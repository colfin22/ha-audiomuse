"""Config flow tests (need Home Assistant)."""

from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")

from homeassistant import config_entries  # noqa: E402
from homeassistant.const import CONF_API_TOKEN, CONF_URL  # noqa: E402
from homeassistant.data_entry_flow import FlowResultType  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.audiomuse.api import AudioMuseAuthError, AudioMuseConnectionError  # noqa: E402
from custom_components.audiomuse.const import CONF_AI_MODEL, CONF_DEFAULT_COUNT, DOMAIN  # noqa: E402

from .common import TOKEN, URL  # noqa: E402

VERSION = "custom_components.audiomuse.api.AudioMuseClient.get_version"


async def _start(hass):
    return await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})


async def test_user_flow_creates_entry(hass):
    result = await _start(hass)
    assert result["type"] is FlowResultType.FORM
    with patch(VERSION, AsyncMock(return_value="v3.7.1")), patch(
        "custom_components.audiomuse.async_setup_entry", AsyncMock(return_value=True)
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_URL: "audiomuse.test:8000/", CONF_API_TOKEN: TOKEN}
        )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "AudioMuse-AI (audiomuse.test)"
    assert result["data"] == {CONF_URL: URL, CONF_API_TOKEN: TOKEN}


@pytest.mark.parametrize(
    ("side_effect", "error"),
    [
        (AsyncMock(side_effect=AudioMuseAuthError("no")), "invalid_auth"),
        (AsyncMock(side_effect=AudioMuseConnectionError("down")), "cannot_connect"),
        (AsyncMock(return_value="v3.6.9"), "unsupported_version"),
    ],
)
async def test_user_flow_errors(hass, side_effect, error):
    result = await _start(hass)
    with patch(VERSION, side_effect):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_URL: URL, CONF_API_TOKEN: TOKEN}
        )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": error}


async def test_duplicate_server_aborts(hass):
    MockConfigEntry(domain=DOMAIN, unique_id=URL.lower(), data={CONF_URL: URL, CONF_API_TOKEN: TOKEN}).add_to_hass(hass)
    result = await _start(hass)
    with patch(VERSION, AsyncMock(return_value="v3.7.1")):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_URL: URL + "/", CONF_API_TOKEN: TOKEN}
        )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reauth_updates_token(hass):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=URL.lower(), data={CONF_URL: URL, CONF_API_TOKEN: "old"})
    entry.add_to_hass(hass)
    result = await entry.start_reauth_flow(hass)
    assert result["step_id"] == "reauth_confirm"
    with patch(VERSION, AsyncMock(return_value="v3.7.1")), patch(
        "custom_components.audiomuse.async_setup_entry", AsyncMock(return_value=True)
    ):
        result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_API_TOKEN: "new"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reauth_successful"
    assert entry.data[CONF_API_TOKEN] == "new"


async def test_options_flow_drops_empty_values(hass):
    entry = MockConfigEntry(domain=DOMAIN, unique_id=URL.lower(), data={CONF_URL: URL, CONF_API_TOKEN: TOKEN})
    entry.add_to_hass(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_DEFAULT_COUNT: 30, CONF_AI_MODEL: ""}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options == {CONF_DEFAULT_COUNT: 30}
