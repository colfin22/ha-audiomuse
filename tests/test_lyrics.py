"""Lyrics detection: sensor and the page's lyrics flag (need Home Assistant)."""

import itertools
from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from homeassistant.config_entries import ConfigEntryState  # noqa: E402
from homeassistant.const import CONF_API_TOKEN, CONF_URL  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.audiomuse.api import AudioMuseResponseError, LyricsStats  # noqa: E402
from custom_components.audiomuse.const import DOMAIN  # noqa: E402

from .common import SERVERS, SUMMARY, TOKEN, URL  # noqa: E402

CLIENT = "custom_components.audiomuse.api.AudioMuseClient"
_IDS = itertools.count(1)


@pytest.fixture(autouse=True)
def base_client():
    with patch(f"{CLIENT}.get_version", AsyncMock(return_value="v3.7.1")), patch(
        f"{CLIENT}.get_summary", AsyncMock(return_value=SUMMARY)
    ), patch(f"{CLIENT}.get_servers", AsyncMock(return_value=SERVERS)):
        yield


async def _setup(hass):
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=URL.lower(), title="AudioMuse-AI (audiomuse.test)",
        data={CONF_URL: URL, CONF_API_TOKEN: TOKEN},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _info(hass, hass_ws_client):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": next(_IDS), "type": "audiomuse/info"})
    return (await ws.receive_json())["result"]["entries"][0]


@pytest.mark.parametrize(
    ("stats", "available", "songs_state"),
    [
        (LyricsStats(enabled=False, songs=0), False, "0"),
        (LyricsStats(enabled=True, songs=0), False, "0"),
        (LyricsStats(enabled=True, songs=420), True, "420"),
    ],
)
async def test_lyrics_flag_and_sensor(hass, hass_ws_client, mock_lyrics_stats, stats, available, songs_state):
    mock_lyrics_stats.return_value = stats
    await _setup(hass)
    entry_info = await _info(hass, hass_ws_client)
    assert entry_info["lyrics_available"] is available
    assert entry_info["lyrics_songs"] == stats.songs
    sensor = hass.states.get("sensor.audiomuse_ai_audiomuse_test_songs_with_lyrics_analysed")
    assert sensor.state == songs_state
    assert sensor.attributes["lyrics_enabled"] is stats.enabled


async def test_server_without_lyrics_stats_still_loads(hass, hass_ws_client, mock_lyrics_stats):
    mock_lyrics_stats.side_effect = AudioMuseResponseError("not found", 404)
    entry = await _setup(hass)
    assert entry.state is ConfigEntryState.LOADED
    entry_info = await _info(hass, hass_ws_client)
    assert entry_info["lyrics_available"] is False and entry_info["lyrics_songs"] is None
