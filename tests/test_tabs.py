"""Tabs added for issue #15 (need Home Assistant)."""

from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from custom_components.audiomuse.api import Track  # noqa: E402

from .test_phase3 import CLIENT, _setup, _ws, mock_client  # noqa: E402,F401

pytestmark = pytest.mark.usefixtures("mock_client")

SONGS = [Track("s1", "There Goes the Fear", "Doves", "The Last Broadcast")]
SIMILAR_SONGS = [Track("t1", "Pounding", "Doves", None), Track("t2", "Teardrop", "Massive Attack", None)]


async def test_search_tracks(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(f"{CLIENT}.search_tracks", AsyncMock(return_value=SONGS)) as search:
        msg = await _ws(ws, {"type": "audiomuse/search_tracks", "entry_id": entry.entry_id, "query": "There Goes"})
    assert msg["success"]
    search.assert_awaited_once_with("There Goes")
    assert msg["result"]["tracks"][0] == {
        "item_id": "s1", "title": "There Goes the Fear", "artist": "Doves", "album": "The Last Broadcast",
    }


async def test_similar_tracks_options_reach_the_client(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(f"{CLIENT}.similar_tracks", AsyncMock(return_value=SIMILAR_SONGS)) as similar:
        msg = await _ws(ws, {
            "type": "audiomuse/similar_tracks", "entry_id": entry.entry_id, "item_id": "s1",
            "count": 30, "limit_per_artist": False, "radius_similarity": True,
        })
    assert msg["success"]
    similar.assert_awaited_once_with(
        item_id="s1", anchor_id=None, count=30, limit_per_artist=False, radius_similarity=True
    )
    assert [t["item_id"] for t in msg["result"]["tracks"]] == ["t1", "t2"]


async def test_similar_tracks_needs_a_song_or_anchor(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/similar_tracks", "entry_id": entry.entry_id})
    assert not msg["success"]


async def test_anchors(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(f"{CLIENT}.get_anchors", AsyncMock(return_value=[{"id": 3, "name": "Post-rock calm"}])):
        msg = await _ws(ws, {"type": "audiomuse/anchors", "entry_id": entry.entry_id})
    assert msg["result"] == {"anchors": [{"id": 3, "name": "Post-rock calm"}]}


async def test_save_accepts_song_source(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {
        "type": "audiomuse/save", "entry_id": entry.entry_id, "name": "Like There Goes the Fear",
        "item_ids": ["t1", "t2"], "source": "song", "detail": "There Goes the Fear",
    })
    assert msg["success"]
    msg = await _ws(ws, {"type": "audiomuse/recent", "entry_id": entry.entry_id})
    assert msg["result"]["items"][0]["source"] == "song"


async def test_find_path_reaches_the_client(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(f"{CLIENT}.find_path", AsyncMock(return_value=SIMILAR_SONGS)) as path:
        msg = await _ws(ws, {
            "type": "audiomuse/find_path", "entry_id": entry.entry_id,
            "start": {"type": "song", "id": "s1"}, "end": {"type": "mood", "id": "relaxed"},
            "count": 15, "exact": False,
        })
    assert msg["success"], msg
    path.assert_awaited_once_with(
        start_song="s1", start_mood=None, start_anchor=None,
        end_song=None, end_mood="relaxed", end_anchor=None,
        count=15, exact=False, lyrics=False,
    )
    assert [t["item_id"] for t in msg["result"]["tracks"]] == ["t1", "t2"]


async def test_find_path_bad_combination_is_a_clear_error(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {
        "type": "audiomuse/find_path", "entry_id": entry.entry_id,
        "start": {"type": "mood", "id": "happy"}, "end": {"type": "mood", "id": "sad"},
    })
    assert not msg["success"]
    assert "mood or anchor" in msg["error"]["message"]


async def test_save_accepts_path_source(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {
        "type": "audiomuse/save", "entry_id": entry.entry_id, "name": "Start to End",
        "item_ids": ["t1", "t2"], "source": "path", "detail": "Start → End",
    })
    assert msg["success"]
    msg = await _ws(ws, {"type": "audiomuse/recent", "entry_id": entry.entry_id})
    assert msg["result"]["items"][0]["source"] == "path"
