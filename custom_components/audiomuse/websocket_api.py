"""Websocket commands used by the AudioMuse sidebar page.

They are thin wrappers around the same helpers as the actions, so the page and
automations behave the same way.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.translation import async_get_exception_message

from .api import AudioMuseError
from .const import (
    CONF_DEFAULT_PLAYER,
    DOMAIN,
    MA_MAPPING_BY_SERVER_TYPE,
    MAX_COUNT,
    MIN_COUNT,
    MUSIC_ASSISTANT_DOMAIN,
)
from .services import (
    async_make_instant,
    async_play_playlist,
    async_save_and_play,
    default_count,
    music_assistant_media_id,
)


@callback
def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register the page's websocket commands."""
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_ideas)
    websocket_api.async_register_command(hass, ws_instant)
    websocket_api.async_register_command(hass, ws_save)
    websocket_api.async_register_command(hass, ws_play)


def _loaded_entries(hass: HomeAssistant) -> list:
    return [e for e in hass.config_entries.async_entries(DOMAIN) if e.state is ConfigEntryState.LOADED]


def _entry(hass: HomeAssistant, entry_id: str):
    for entry in _loaded_entries(hass):
        if entry.entry_id == entry_id:
            return entry
    raise ServiceValidationError(translation_domain=DOMAIN, translation_key="entry_not_found")


def _error_text(err: HomeAssistantError) -> str:
    text = str(err)
    if not text and err.translation_key:
        text = async_get_exception_message(
            err.translation_domain or DOMAIN, err.translation_key, err.translation_placeholders
        )
    return text or "Something went wrong"


async def _run(connection, msg, coro) -> None:
    """Run a command and translate failures into readable websocket errors."""
    try:
        connection.send_result(msg["id"], await coro)
    except ServiceValidationError as err:
        connection.send_error(msg["id"], "invalid", _error_text(err))
    except (HomeAssistantError, AudioMuseError) as err:
        text = _error_text(err) if isinstance(err, HomeAssistantError) else str(err)
        connection.send_error(msg["id"], "failed", text)


def _players(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Music Assistant speakers, found dynamically from the entity registry."""
    registry = er.async_get(hass)
    players = []
    for ent in registry.entities.values():
        if ent.platform != MUSIC_ASSISTANT_DOMAIN or ent.domain != "media_player" or ent.disabled:
            continue
        state = hass.states.get(ent.entity_id)
        name = (state.attributes.get("friendly_name") if state else None) or ent.name or ent.original_name
        players.append(
            {"entity_id": ent.entity_id, "name": name or ent.entity_id, "state": state.state if state else None}
        )
    return sorted(players, key=lambda p: str(p["name"]).lower())


@websocket_api.websocket_command({vol.Required("type"): "audiomuse/info"})
@websocket_api.async_response
async def ws_info(hass: HomeAssistant, connection, msg) -> None:
    """Servers, their status and the speakers the page can play on."""
    entries = []
    for entry in _loaded_entries(hass):
        data = entry.runtime_data.coordinator.data
        server = data.default_server if data else None
        mapping = MA_MAPPING_BY_SERVER_TYPE.get(server.server_type) if server else None
        entries.append(
            {
                "entry_id": entry.entry_id,
                "title": entry.title,
                "version": data.version if data else None,
                "music_server": server.name if server else None,
                "music_server_type": server.server_type if server else None,
                "playback": bool(music_assistant_media_id(entry, "x")),
                "playback_verified": bool(mapping and mapping.verified),
                "default_count": default_count(entry),
                "default_player": entry.options.get(CONF_DEFAULT_PLAYER),
                "songs_analysed": data.summary.songs_analysed if data else None,
                "albums": data.summary.albums if data else None,
                "busy_workers": data.summary.busy_workers if data else 0,
            }
        )
    connection.send_result(
        msg["id"],
        {
            "entries": entries,
            "players": _players(hass),
            "music_assistant": hass.services.has_service(MUSIC_ASSISTANT_DOMAIN, "play_media"),
            "min_count": MIN_COUNT,
            "max_count": MAX_COUNT,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "audiomuse/ideas", vol.Required("entry_id"): str})
@websocket_api.async_response
async def ws_ideas(hass: HomeAssistant, connection, msg) -> None:
    """AudioMuse-AI's suggested prompts."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        try:
            return {"ideas": await entry.runtime_data.client.playlist_ideas()}
        except AudioMuseError as err:
            raise HomeAssistantError(f"Could not load playlist ideas: {err}") from err

    await _run(connection, msg, go())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/instant",
        vol.Required("entry_id"): str,
        vol.Required("prompt"): vol.All(cv.string, vol.Length(min=1, max=2000)),
        vol.Optional("count"): vol.All(vol.Coerce(int), vol.Range(min=MIN_COUNT, max=MAX_COUNT)),
    }
)
@websocket_api.async_response
async def ws_instant(hass: HomeAssistant, connection, msg) -> None:
    """Make an Instant Playlist (songs only; saving is a separate step on the page)."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        result = await async_make_instant(entry, msg["prompt"], msg.get("count"))
        return {
            "tracks": [t.as_dict() for t in result.tracks],
            "ai_provider": result.ai_provider,
            "ai_model": result.ai_model,
            "message": result.message,
        }

    await _run(connection, msg, go())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/save",
        vol.Required("entry_id"): str,
        vol.Required("name"): vol.All(cv.string, vol.Length(min=1, max=200)),
        vol.Required("item_ids"): vol.All([cv.string], vol.Length(min=1)),
        vol.Optional("play_on"): cv.entity_id,
    }
)
@websocket_api.async_response
async def ws_save(hass: HomeAssistant, connection, msg) -> None:
    """Save songs as a playlist, and optionally play it."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        return await async_save_and_play(
            hass, entry, msg["name"], msg["item_ids"], save=True, play_on=msg.get("play_on")
        )

    await _run(connection, msg, go())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/play",
        vol.Required("entry_id"): str,
        vol.Required("playlist_id"): str,
        vol.Required("entity_id"): cv.entity_id,
    }
)
@websocket_api.async_response
async def ws_play(hass: HomeAssistant, connection, msg) -> None:
    """Play a saved playlist on a speaker."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        await async_play_playlist(hass, entry, msg["playlist_id"], msg["entity_id"])
        return {"played_on": msg["entity_id"]}

    await _run(connection, msg, go())
