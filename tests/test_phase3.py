"""Similar artists, Radios and Recent (need Home Assistant)."""

import itertools
from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from homeassistant.const import CONF_API_TOKEN, CONF_URL  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.audiomuse.api import Artist  # noqa: E402
from custom_components.audiomuse.const import DOMAIN  # noqa: E402
from custom_components.audiomuse.recent import STORAGE_KEY  # noqa: E402

from .common import INSTANT, SAVED, SERVERS, SIMILAR, SUMMARY, TOKEN, TRACKS, URL  # noqa: E402

CLIENT = "custom_components.audiomuse.api.AudioMuseClient"


@pytest.fixture
def mock_client():
    with patch(f"{CLIENT}.get_version", AsyncMock(return_value="v3.7.1")), patch(
        f"{CLIENT}.get_summary", AsyncMock(return_value=SUMMARY)
    ), patch(f"{CLIENT}.get_servers", AsyncMock(return_value=SERVERS)), patch(
        f"{CLIENT}.instant_playlist", AsyncMock(return_value=INSTANT)
    ), patch(f"{CLIENT}.save_playlist", AsyncMock(return_value=SAVED)) as save, patch(
        f"{CLIENT}.similar_artists", AsyncMock(return_value=SIMILAR)
    ), patch(f"{CLIENT}.artist_tracks", AsyncMock(return_value=TRACKS)), patch(
        f"{CLIENT}.search_artists", AsyncMock(return_value=[Artist("Alice", "a1", 42)])
    ), patch(
        f"{CLIENT}.get_radios",
        AsyncMock(return_value=[{"id": 1, "anchor_id": 9, "name": "Morning", "temperature": 0.5, "n_results": 40, "enabled": True}]),
    ), patch(
        f"{CLIENT}.run_radios",
        AsyncMock(return_value={"message": "done", "radios_enabled": 1, "playlists_created": 1, "failed": []}),
    ) as run:
        yield {"save": save, "run": run}


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=URL.lower(), title="AudioMuse-AI (audiomuse.test)",
        data={CONF_URL: URL, CONF_API_TOKEN: TOKEN},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


_IDS = itertools.count(1)


async def _ws(ws, payload):
    await ws.send_json({"id": next(_IDS), **payload})
    return await ws.receive_json()


async def test_artist_search_similar_and_mix(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/search_artists", "entry_id": entry.entry_id, "query": "ali"})
    assert msg["result"]["artists"][0] == {"name": "Alice", "artist_id": "a1", "track_count": 42, "divergence": None}
    msg = await _ws(ws, {"type": "audiomuse/similar_artists", "entry_id": entry.entry_id, "artist": "Alice"})
    assert [a["name"] for a in msg["result"]["artists"]] == ["Bob", "Carol"]
    msg = await _ws(ws, {"type": "audiomuse/artist_mix", "entry_id": entry.entry_id, "artist": "Alice", "count": 10})
    assert msg["success"]
    assert msg["result"]["artists"] == ["Alice", "Bob", "Carol"]
    assert {t["item_id"] for t in msg["result"]["tracks"]} == {"t1", "t2"}
    mock_client["save"].assert_not_awaited()


async def test_radios_list_and_refresh(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/radios", "entry_id": entry.entry_id})
    assert msg["result"]["radios"] == [{"id": 1, "name": "Morning", "songs": 40, "enabled": True}]
    msg = await _ws(ws, {"type": "audiomuse/run_radios", "entry_id": entry.entry_id})
    assert msg["result"] == {"message": "done", "radios_enabled": 1, "playlists_created": 1, "failed": []}
    mock_client["run"].assert_awaited_once()


async def test_saves_are_recorded_in_recent(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    await _ws(ws, {
        "type": "audiomuse/save", "entry_id": entry.entry_id, "name": "Alice and similar",
        "item_ids": ["t1", "t2"], "source": "artist", "detail": "Alice",
    })
    await hass.services.async_call(
        DOMAIN, "instant_playlist", {"prompt": "rainy day"}, blocking=True, return_response=True
    )
    msg = await _ws(ws, {"type": "audiomuse/recent", "entry_id": entry.entry_id})
    items = msg["result"]["items"]
    assert [(i["source"], i["detail"], i["playlist_name"], i["track_count"]) for i in items] == [
        ("instant", "rainy day", "Rainy day_instant", 2),
        ("artist", "Alice", "Alice and similar_instant", 2),
    ]
    assert all(i["playlist_id"] == "pl1" for i in items)
    msg = await _ws(ws, {"type": "audiomuse/recent_remove", "item_id": items[0]["id"]})
    assert msg["result"] == {"removed": True}
    msg = await _ws(ws, {"type": "audiomuse/recent"})
    assert [i["source"] for i in msg["result"]["items"]] == ["artist"]


async def test_recent_survives_restart(hass, hass_storage, hass_ws_client, mock_client):
    hass_storage[STORAGE_KEY] = {
        "version": 1, "key": STORAGE_KEY,
        "data": {"items": [{"id": "x1", "entry_id": "e", "playlist_id": "p", "playlist_name": "Old_instant",
                            "source": "instant", "detail": "old", "track_count": 5, "created": "2026-01-01T00:00:00+00:00"}]},
    }
    await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/recent"})
    assert [i["playlist_name"] for i in msg["result"]["items"]] == ["Old_instant"]


async def test_info_includes_server_url(hass, hass_ws_client, mock_client):
    await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/info"})
    assert msg["result"]["entries"][0]["url"] == URL
