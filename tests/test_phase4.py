"""Quick search, AI detection and offline status (need Home Assistant)."""

import itertools
from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from homeassistant.config_entries import ConfigEntryState  # noqa: E402
from homeassistant.const import CONF_API_TOKEN, CONF_URL  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.audiomuse.api import (  # noqa: E402
    AudioMuseConnectionError,
    AudioMuseResponseError,
)
from custom_components.audiomuse.const import CONF_AI_PROVIDER, DOMAIN  # noqa: E402

from .common import INSTANT, SAVED, SERVERS, SUMMARY, TOKEN, TRACKS, URL  # noqa: E402

CLIENT = "custom_components.audiomuse.api.AudioMuseClient"
_IDS = itertools.count(1)


@pytest.fixture
def mock_client():
    with patch(f"{CLIENT}.get_version", AsyncMock(return_value="v3.7.1")) as version, patch(
        f"{CLIENT}.get_summary", AsyncMock(return_value=SUMMARY)
    ), patch(f"{CLIENT}.get_servers", AsyncMock(return_value=SERVERS)), patch(
        f"{CLIENT}.instant_playlist", AsyncMock(return_value=INSTANT)
    ) as instant, patch(f"{CLIENT}.save_playlist", AsyncMock(return_value=SAVED)), patch(
        f"{CLIENT}.text_search", AsyncMock(return_value=TRACKS)
    ) as search:
        yield {"instant": instant, "search": search, "version": version}


async def _setup(hass, options=None):
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id=URL.lower(), title="AudioMuse-AI (audiomuse.test)",
        data={CONF_URL: URL, CONF_API_TOKEN: TOKEN}, options=options or {},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _ws(ws, payload):
    await ws.send_json({"id": next(_IDS), **payload})
    return await ws.receive_json()


async def test_ws_search_uses_text_search(hass, hass_ws_client, mock_client):
    entry = await _setup(hass)
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/search", "entry_id": entry.entry_id, "query": "calm piano", "count": 10})
    assert [t["item_id"] for t in msg["result"]["tracks"]] == ["t1", "t2"]
    mock_client["search"].assert_awaited_once_with("calm piano", 10)
    mock_client["instant"].assert_not_awaited()


async def test_action_search_mode(hass, mock_client):
    await _setup(hass)
    resp = await hass.services.async_call(
        DOMAIN, "instant_playlist", {"prompt": "calm piano", "mode": "search", "save": False},
        blocking=True, return_response=True,
    )
    assert resp["ai_model"] is None and len(resp["tracks"]) == 2
    mock_client["instant"].assert_not_awaited()


@pytest.mark.parametrize(
    ("server_provider", "options", "expected"),
    [("OPENAI", {}, True), ("NONE", {}, False), ("NONE", {CONF_AI_PROVIDER: "OLLAMA"}, True), (None, {}, True)],
)
async def test_ai_configured(hass, hass_ws_client, mock_client, mock_ai_provider, server_provider, options, expected):
    if server_provider is None:
        mock_ai_provider.side_effect = AudioMuseResponseError("older server")
    else:
        mock_ai_provider.return_value = server_provider
    entry = await _setup(hass, options)
    assert entry.state is ConfigEntryState.LOADED
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/info"})
    assert msg["result"]["entries"][0]["ai_configured"] is expected
    assert msg["result"]["entries"][0]["available"] is True


async def test_unreachable_server_is_listed_as_unavailable(hass, hass_ws_client, mock_client):
    mock_client["version"].side_effect = AudioMuseConnectionError("down")
    entry = await _setup(hass)
    assert entry.state is ConfigEntryState.SETUP_RETRY
    ws = await hass_ws_client(hass)
    msg = await _ws(ws, {"type": "audiomuse/info"})
    assert msg["result"]["entries"] == []
    assert msg["result"]["unavailable"][0]["title"] == "AudioMuse-AI (audiomuse.test)"
    assert msg["result"]["unavailable"][0]["state"] == "setup_retry"
