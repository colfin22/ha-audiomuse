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


ALCHEMY_RESULT_BLEND = {"centroid": [0.1], "inclusions": [], "exclusions": [], "inclusions_embedding": None}


async def test_alchemy_then_save_anchor_uses_the_kept_blend(hass, hass_ws_client):
    from custom_components.audiomuse.api import AlchemyResult

    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(
        f"{CLIENT}.alchemy", AsyncMock(return_value=AlchemyResult(SIMILAR_SONGS, ALCHEMY_RESULT_BLEND, removed=76))
    ) as alchemy, patch(f"{CLIENT}.save_anchor", AsyncMock(return_value={"id": 7, "name": "Calm"})) as save:
        msg = await _ws(ws, {
            "type": "audiomuse/alchemy", "entry_id": entry.entry_id,
            "items": [{"type": "artist", "id": "Mogwai", "op": "include"}, {"type": "song", "id": "s9", "op": "exclude"}],
            "count": 25, "temperature": 0.5,
        })
        assert msg["success"], msg
        alchemy.assert_awaited_once_with(
            [{"type": "artist", "id": "Mogwai", "op": "ADD"}, {"type": "song", "id": "s9", "op": "SUBTRACT"}],
            count=25, temperature=0.5, subtract_distance=None,
        )
        assert [t["item_id"] for t in msg["result"]["tracks"]] == ["t1", "t2"]
        assert msg["result"]["removed"] == 76
        assert "centroid" not in str(msg["result"])  # the blend stays in Home Assistant
        blend_id = msg["result"]["blend_id"]
        msg = await _ws(ws, {"type": "audiomuse/save_anchor", "entry_id": entry.entry_id, "blend_id": blend_id, "name": "Calm"})
    assert msg["result"] == {"anchor": {"id": 7, "name": "Calm"}}
    save.assert_awaited_once_with("Calm", ALCHEMY_RESULT_BLEND)


async def test_save_anchor_with_an_unknown_blend_is_a_clear_error(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/save_anchor", "entry_id": entry.entry_id, "blend_id": "nope", "name": "X"})
    assert not msg["success"]
    assert "Run Alchemy again" in msg["error"]["message"]


async def test_rename_and_delete_anchor(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(f"{CLIENT}.rename_anchor", AsyncMock()) as rename, patch(f"{CLIENT}.delete_anchor", AsyncMock()) as delete:
        assert (await _ws(ws, {"type": "audiomuse/rename_anchor", "entry_id": entry.entry_id, "anchor_id": 7, "name": "New"}))["success"]
        assert (await _ws(ws, {"type": "audiomuse/delete_anchor", "entry_id": entry.entry_id, "anchor_id": 7}))["success"]
    rename.assert_awaited_once_with(7, "New")
    delete.assert_awaited_once_with(7)


async def test_radios_list_includes_anchor_and_temperature(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/radios", "entry_id": entry.entry_id})
    assert msg["result"]["radios"] == [
        {"id": 1, "name": "Morning", "songs": 40, "enabled": True, "anchor_id": 9, "temperature": 0.5}
    ]


async def test_add_update_delete_radio(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    with patch(f"{CLIENT}.add_radio", AsyncMock()) as add, patch(f"{CLIENT}.update_radio", AsyncMock()) as update, patch(
        f"{CLIENT}.delete_radio", AsyncMock()
    ) as delete:
        assert (await _ws(ws, {
            "type": "audiomuse/add_radio", "entry_id": entry.entry_id, "anchor_id": 9, "temperature": 0.5, "songs": 40,
        }))["success"]
        assert (await _ws(ws, {"type": "audiomuse/update_radio", "entry_id": entry.entry_id, "radio_id": 1, "enabled": False}))["success"]
        assert (await _ws(ws, {"type": "audiomuse/delete_radio", "entry_id": entry.entry_id, "radio_id": 1}))["success"]
    add.assert_awaited_once_with(9, temperature=0.5, songs=40, enabled=True)
    update.assert_awaited_once_with(1, temperature=None, songs=None, enabled=False)
    delete.assert_awaited_once_with(1)


async def test_save_accepts_alchemy_source(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {
        "type": "audiomuse/save", "entry_id": entry.entry_id, "name": "Mogwai alchemy",
        "item_ids": ["t1"], "source": "alchemy", "detail": "Mogwai",
    })
    assert msg["success"]


async def test_lyrics_axes_and_search(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    axes = [{"id": "AXIS_1_SETTING", "name": "Setting", "description": "d", "labels": []}]
    with patch(f"{CLIENT}.lyrics_axes", AsyncMock(return_value=axes)), patch(
        f"{CLIENT}.lyrics_by_axes", AsyncMock(return_value=SONGS)
    ) as by_axes, patch(f"{CLIENT}.lyrics_by_text", AsyncMock(return_value=SONGS)) as by_text, patch(
        f"{CLIENT}.lyrics_by_song", AsyncMock(return_value=SIMILAR_SONGS)
    ) as by_song:
        msg = await _ws(ws, {"type": "audiomuse/lyrics_axes", "entry_id": entry.entry_id})
        assert msg["result"] == {"axes": axes}
        base = {"type": "audiomuse/lyrics_search", "entry_id": entry.entry_id, "count": 20}
        assert (await _ws(ws, {**base, "targets": {"AXIS_1_SETTING": "INTERIOR"}}))["success"]
        assert (await _ws(ws, {**base, "query": "leaving home"}))["success"]
        msg = await _ws(ws, {**base, "item_id": "s1"})
    assert [t["item_id"] for t in msg["result"]["tracks"]] == ["t1", "t2"]
    by_axes.assert_awaited_once_with({"AXIS_1_SETTING": "INTERIOR"}, count=20)
    by_text.assert_awaited_once_with("leaving home", count=20)
    by_song.assert_awaited_once_with("s1", count=20)


async def test_lyrics_search_needs_exactly_one_way(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    base = {"type": "audiomuse/lyrics_search", "entry_id": entry.entry_id}
    assert not (await _ws(ws, base))["success"]
    assert not (await _ws(ws, {**base, "query": "x", "item_id": "s1"}))["success"]


async def test_save_accepts_lyrics_source(hass, hass_ws_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {
        "type": "audiomuse/save", "entry_id": entry.entry_id, "name": "Leaving home",
        "item_ids": ["t1"], "source": "lyrics", "detail": "leaving home",
    })
    assert msg["success"]
