"""Sidebar page websocket commands and panel registration (need Home Assistant)."""

from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from homeassistant.const import CONF_API_TOKEN, CONF_URL  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402
from pytest_homeassistant_custom_component.common import (  # noqa: E402
    MockConfigEntry,
    async_mock_service,
)

from custom_components.audiomuse.api import AudioMuseResponseError  # noqa: E402
from custom_components.audiomuse.const import DOMAIN  # noqa: E402

from .common import INSTANT, SAVED, SERVERS, SUMMARY, TOKEN, URL  # noqa: E402

CLIENT = "custom_components.audiomuse.api.AudioMuseClient"


@pytest.fixture
def mock_client():
    with patch(f"{CLIENT}.get_version", AsyncMock(return_value="v3.7.1")), patch(
        f"{CLIENT}.get_summary", AsyncMock(return_value=SUMMARY)
    ), patch(f"{CLIENT}.get_servers", AsyncMock(return_value=SERVERS)), patch(
        f"{CLIENT}.instant_playlist", AsyncMock(return_value=INSTANT)
    ) as instant, patch(f"{CLIENT}.save_playlist", AsyncMock(return_value=SAVED)) as save, patch(
        f"{CLIENT}.playlist_ideas", AsyncMock(return_value=["calm piano", "groovy sax blues"])
    ):
        yield {"instant": instant, "save": save}


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=URL.lower(), title="AudioMuse-AI (audiomuse.test)",
        data={CONF_URL: URL, CONF_API_TOKEN: TOKEN},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _add_ma_player(hass, object_id="kitchen", name="Kitchen speaker", features=8320575):
    er.async_get(hass).async_get_or_create(
        "media_player", "music_assistant", f"uid_{object_id}", suggested_object_id=object_id
    )
    hass.states.async_set(
        f"media_player.{object_id}", "idle", {"friendly_name": name, "supported_features": features}
    )


async def test_panel_added_and_removed(hass, mock_client):
    entry = await _setup(hass)
    panels = hass.data["frontend_panels"]
    assert "audiomuse" in panels
    module_url = panels["audiomuse"].config["_panel_custom"]["module_url"]
    assert module_url.startswith("/audiomuse_static/audiomuse-panel.js?v=")
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert "audiomuse" not in hass.data["frontend_panels"]


async def test_info_lists_servers_and_ma_players(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    _add_ma_player(hass)
    # Music Assistant "dashboard display" cast: same name, cannot queue music.
    _add_ma_player(hass, "kitchen_display", "Kitchen speaker", features=131840)
    async_mock_service(hass, "music_assistant", "play_media")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "audiomuse/info"})
    msg = await ws.receive_json()
    assert msg["success"]
    info = msg["result"]
    assert info["entries"][0]["entry_id"] == entry.entry_id
    assert info["entries"][0]["playback"] is True
    assert info["entries"][0]["playback_verified"] is True
    assert info["entries"][0]["songs_analysed"] == 1200
    assert info["players"] == [{"entity_id": "media_player.kitchen", "name": "Kitchen speaker", "state": "idle"}]
    assert info["music_assistant"] is True


async def test_instant_then_save_and_play(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    play = async_mock_service(hass, "music_assistant", "play_media")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "audiomuse/instant", "entry_id": entry.entry_id, "prompt": "rainy", "count": 10})
    msg = await ws.receive_json()
    assert msg["success"]
    assert [t["item_id"] for t in msg["result"]["tracks"]] == ["t1", "t2"]
    mock_client["save"].assert_not_awaited()

    await ws.send_json({
        "id": 2, "type": "audiomuse/save", "entry_id": entry.entry_id, "name": "Rainy",
        "item_ids": ["t1", "t2"], "play_on": "media_player.kitchen",
    })
    msg = await ws.receive_json()
    assert msg["success"]
    assert msg["result"] == {"playlist_id": "pl1", "playlist_name": "Rainy_instant", "played_on": "media_player.kitchen"}
    assert play[0].data["media_id"] == "opensubsonic://playlist/pl1"


async def test_ai_failure_is_a_readable_error(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    mock_client["instant"].side_effect = AudioMuseResponseError("AI provider not configured")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "audiomuse/instant", "entry_id": entry.entry_id, "prompt": "x"})
    msg = await ws.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "failed"
    assert "AI provider not configured" in msg["error"]["message"]


async def test_unknown_entry_is_invalid(hass, hass_ws_client, mock_client):
    await _setup(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "audiomuse/ideas", "entry_id": "nope"})
    msg = await ws.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid"
    assert msg["error"]["message"]


async def test_ideas(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "audiomuse/ideas", "entry_id": entry.entry_id})
    msg = await ws.receive_json()
    assert msg["result"] == {"ideas": ["calm piano", "groovy sax blues"]}
