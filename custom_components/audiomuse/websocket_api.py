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
from .recent import get_recent
from .services import (
    ai_configured,
    async_make_artist_mix,
    async_make_instant,
    async_make_search,
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
    websocket_api.async_register_command(hass, ws_search_artists)
    websocket_api.async_register_command(hass, ws_similar_artists)
    websocket_api.async_register_command(hass, ws_artist_mix)
    websocket_api.async_register_command(hass, ws_radios)
    websocket_api.async_register_command(hass, ws_run_radios)
    websocket_api.async_register_command(hass, ws_recent)
    websocket_api.async_register_command(hass, ws_recent_remove)
    websocket_api.async_register_command(hass, ws_search)


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
    unavailable = [
        {"entry_id": e.entry_id, "title": e.title, "state": e.state.value, "reason": e.reason}
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.state is not ConfigEntryState.LOADED and not e.disabled_by
    ]
    for entry in _loaded_entries(hass):
        coordinator = entry.runtime_data.coordinator
        data = coordinator.data
        server = data.default_server if data else None
        mapping = MA_MAPPING_BY_SERVER_TYPE.get(server.server_type) if server else None
        entries.append(
            {
                "entry_id": entry.entry_id,
                "title": entry.title,
                "url": entry.runtime_data.client.url,
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
                "available": coordinator.last_update_success,
                "ai_configured": ai_configured(entry),
            }
        )
    connection.send_result(
        msg["id"],
        {
            "entries": entries,
            "unavailable": unavailable,
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
        vol.Optional("source", default="page"): vol.In(["page", "instant", "search", "artist"]),
        vol.Optional("detail"): vol.All(cv.string, vol.Length(max=2000)),
    }
)
@websocket_api.async_response
async def ws_save(hass: HomeAssistant, connection, msg) -> None:
    """Save songs as a playlist, and optionally play it."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        return await async_save_and_play(
            hass, entry, msg["name"], msg["item_ids"], save=True, play_on=msg.get("play_on"),
            source=msg["source"], detail=msg.get("detail"),
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/search_artists",
        vol.Required("entry_id"): str,
        vol.Required("query"): vol.All(cv.string, vol.Length(min=1, max=200)),
    }
)
@websocket_api.async_response
async def ws_search_artists(hass: HomeAssistant, connection, msg) -> None:
    """Find analysed artists by name."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        try:
            artists = await entry.runtime_data.client.search_artists(msg["query"])
        except AudioMuseError as err:
            raise HomeAssistantError(f"Artist search failed: {err}") from err
        return {"artists": [a.as_dict() for a in artists[:25]]}

    await _run(connection, msg, go())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/similar_artists",
        vol.Required("entry_id"): str,
        vol.Required("artist"): cv.string,
        vol.Optional("count", default=10): vol.All(vol.Coerce(int), vol.Range(min=1, max=50)),
    }
)
@websocket_api.async_response
async def ws_similar_artists(hass: HomeAssistant, connection, msg) -> None:
    """Artists that sound like the given one."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        try:
            artists = await entry.runtime_data.client.similar_artists(
                artist=msg["artist"], count=msg["count"]
            )
        except AudioMuseError as err:
            raise HomeAssistantError(f"Similar artists failed: {err}") from err
        return {"artists": [a.as_dict() for a in artists]}

    await _run(connection, msg, go())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/artist_mix",
        vol.Required("entry_id"): str,
        vol.Required("artist"): cv.string,
        vol.Optional("include_similar", default=4): vol.All(vol.Coerce(int), vol.Range(min=0, max=20)),
        vol.Optional("count"): vol.All(vol.Coerce(int), vol.Range(min=MIN_COUNT, max=MAX_COUNT)),
    }
)
@websocket_api.async_response
async def ws_artist_mix(hass: HomeAssistant, connection, msg) -> None:
    """An artist plus similar artists, as songs (saving is a separate step)."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        names, tracks = await async_make_artist_mix(
            entry, msg["artist"], msg["include_similar"], msg.get("count")
        )
        return {"artists": names, "tracks": [t.as_dict() for t in tracks]}

    await _run(connection, msg, go())


@websocket_api.websocket_command({vol.Required("type"): "audiomuse/radios", vol.Required("entry_id"): str})
@websocket_api.async_response
async def ws_radios(hass: HomeAssistant, connection, msg) -> None:
    """Saved AudioMuse-AI Radios."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        try:
            radios = await entry.runtime_data.client.get_radios()
        except AudioMuseError as err:
            raise HomeAssistantError(f"Could not load Radios: {err}") from err
        return {
            "radios": [
                {
                    "id": r.get("id"),
                    "name": r.get("name"),
                    "songs": r.get("n_results"),
                    "enabled": bool(r.get("enabled")),
                }
                for r in radios
            ]
        }

    await _run(connection, msg, go())


@websocket_api.websocket_command({vol.Required("type"): "audiomuse/run_radios", vol.Required("entry_id"): str})
@websocket_api.async_response
async def ws_run_radios(hass: HomeAssistant, connection, msg) -> None:
    """Create or refresh one playlist per enabled Radio."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        try:
            result = await entry.runtime_data.client.run_radios()
        except AudioMuseError as err:
            raise HomeAssistantError(f"Could not refresh Radios: {err}") from err
        return {
            "message": result.get("message"),
            "radios_enabled": result.get("radios_enabled"),
            "playlists_created": result.get("playlists_created"),
            "failed": list(result.get("failed") or []),
        }

    await _run(connection, msg, go())


@websocket_api.websocket_command({vol.Required("type"): "audiomuse/recent", vol.Optional("entry_id"): str})
@callback
def ws_recent(hass: HomeAssistant, connection, msg) -> None:
    """Playlists saved from Home Assistant, newest first."""
    recent = get_recent(hass)
    connection.send_result(msg["id"], {"items": recent.items(msg.get("entry_id")) if recent else []})


@websocket_api.websocket_command({vol.Required("type"): "audiomuse/recent_remove", vol.Required("item_id"): str})
@callback
def ws_recent_remove(hass: HomeAssistant, connection, msg) -> None:
    """Forget one recent item (the playlist stays on the music server)."""
    recent = get_recent(hass)
    connection.send_result(msg["id"], {"removed": bool(recent and recent.remove(msg["item_id"]))})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "audiomuse/search",
        vol.Required("entry_id"): str,
        vol.Required("query"): vol.All(cv.string, vol.Length(min=1, max=2000)),
        vol.Optional("count"): vol.All(vol.Coerce(int), vol.Range(min=MIN_COUNT, max=MAX_COUNT)),
    }
)
@websocket_api.async_response
async def ws_search(hass: HomeAssistant, connection, msg) -> None:
    """Songs for a description via text search (no AI; saving is a separate step)."""

    async def go():
        entry = _entry(hass, msg["entry_id"])
        result = await async_make_search(entry, msg["query"], msg.get("count"))
        return {"tracks": [t.as_dict() for t in result.tracks]}

    await _run(connection, msg, go())
