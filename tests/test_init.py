"""Setup, sensor and action tests (need Home Assistant)."""

from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from homeassistant.config_entries import ConfigEntryState  # noqa: E402
from homeassistant.const import CONF_API_TOKEN, CONF_URL  # noqa: E402
from homeassistant.exceptions import ServiceValidationError  # noqa: E402
from pytest_homeassistant_custom_component.common import (  # noqa: E402
    MockConfigEntry,
    async_mock_service,
)

from custom_components.audiomuse.api import AudioMuseAuthError, MusicServer  # noqa: E402
from custom_components.audiomuse.const import CONF_MA_PROVIDER, DOMAIN  # noqa: E402

from .common import INSTANT, SAVED, SERVERS, SIMILAR, SUMMARY, TOKEN, TRACKS, URL  # noqa: E402

CLIENT = "custom_components.audiomuse.api.AudioMuseClient"


@pytest.fixture
def mock_client():
    with patch(f"{CLIENT}.get_version", AsyncMock(return_value="v3.7.1")), patch(
        f"{CLIENT}.get_summary", AsyncMock(return_value=SUMMARY)
    ), patch(f"{CLIENT}.get_servers", AsyncMock(return_value=SERVERS)) as servers, patch(
        f"{CLIENT}.instant_playlist", AsyncMock(return_value=INSTANT)
    ) as instant, patch(f"{CLIENT}.save_playlist", AsyncMock(return_value=SAVED)) as save, patch(
        f"{CLIENT}.similar_artists", AsyncMock(return_value=SIMILAR)
    ), patch(f"{CLIENT}.artist_tracks", AsyncMock(return_value=TRACKS)):
        yield {"instant": instant, "save": save, "servers": servers}


async def _setup(hass, options=None, unique_id=None):
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id=unique_id or URL.lower(),
        title="AudioMuse-AI (audiomuse.test)",
        data={CONF_URL: URL, CONF_API_TOKEN: TOKEN},
        options=options or {},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_setup_creates_sensors(hass, mock_client):
    entry = await _setup(hass)
    assert entry.state is ConfigEntryState.LOADED
    assert hass.states.get("sensor.audiomuse_ai_audiomuse_test_songs_analysed").state == "1200"
    busy = hass.states.get("sensor.audiomuse_ai_audiomuse_test_busy_workers")
    assert busy.state == "1" and busy.attributes["task_types"] == ["album_analysis"]
    version = hass.states.get("sensor.audiomuse_ai_audiomuse_test_version")
    assert version.state == "v3.7.1" and version.attributes["music_server_type"] == "navidrome"
    assert await hass.config_entries.async_unload(entry.entry_id)


async def test_bad_token_starts_reauth(hass):
    with patch(f"{CLIENT}.get_version", AsyncMock(side_effect=AudioMuseAuthError("no"))):
        entry = await _setup(hass)
    assert entry.state is ConfigEntryState.SETUP_ERROR
    flows = hass.config_entries.flow.async_progress()
    assert any(f["context"]["source"] == "reauth" for f in flows)


async def test_instant_playlist_saves_and_plays(hass, mock_client):
    await _setup(hass)
    play = async_mock_service(hass, "music_assistant", "play_media")
    resp = await hass.services.async_call(
        DOMAIN,
        "instant_playlist",
        {"prompt": "rainy day songs", "count": 10, "play_on": "media_player.kitchen"},
        blocking=True,
        return_response=True,
    )
    mock_client["instant"].assert_awaited_once()
    assert mock_client["save"].await_args.args == ("Rainy day songs", ["t1", "t2"])
    assert resp["playlist_id"] == "pl1"
    assert resp["playlist_name"] == "Rainy day songs_instant"
    assert resp["played_on"] == "media_player.kitchen"
    assert [t["item_id"] for t in resp["tracks"]] == ["t1", "t2"]
    assert len(play) == 1
    assert play[0].data["media_id"] == "opensubsonic://playlist/pl1"
    assert play[0].data["media_type"] == "playlist"


async def test_instant_playlist_without_save(hass, mock_client):
    await _setup(hass)
    resp = await hass.services.async_call(
        DOMAIN, "instant_playlist", {"prompt": "x", "save": False}, blocking=True, return_response=True
    )
    mock_client["save"].assert_not_awaited()
    assert resp["playlist_id"] is None


async def test_unknown_server_type_needs_provider_option(hass, mock_client):
    mock_client["servers"].return_value = [MusicServer("s1", "Other", "plex", True)]
    await _setup(hass)
    async_mock_service(hass, "music_assistant", "play_media")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "play_playlist", {"playlist_id": "pl1", "entity_id": "media_player.kitchen"},
            blocking=True, return_response=True,
        )


async def test_provider_option_overrides_detection(hass, mock_client):
    mock_client["servers"].return_value = [MusicServer("s1", "Other", "plex", True)]
    await _setup(hass, options={CONF_MA_PROVIDER: "plex--abc"})
    play = async_mock_service(hass, "music_assistant", "play_media")
    await hass.services.async_call(
        DOMAIN, "play_playlist", {"playlist_id": "pl9", "entity_id": "media_player.kitchen"},
        blocking=True, return_response=True,
    )
    assert play[0].data["media_id"] == "plex--abc://playlist/pl9"


async def test_artist_playlist_mixes_similar_artists(hass, mock_client):
    await _setup(hass)
    resp = await hass.services.async_call(
        DOMAIN, "artist_playlist", {"artist": "Alice", "save": False}, blocking=True, return_response=True
    )
    assert resp["artists"] == ["Alice", "Bob", "Carol"]
    assert {t["item_id"] for t in resp["tracks"]} == {"t1", "t2"}


async def test_two_servers_need_an_entry_id(hass, mock_client):
    await _setup(hass)
    await _setup(hass, unique_id="http://other.test:8000")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "similar_artists", {"artist": "Alice"}, blocking=True, return_response=True
        )
