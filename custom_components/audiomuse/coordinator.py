"""Polling coordinator for AudioMuse-AI status."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .api import (
    AudioMuseAuthError,
    AudioMuseClient,
    AudioMuseError,
    MusicServer,
    Summary,
)
from .const import DOMAIN, SCAN_INTERVAL

_LOGGER = logging.getLogger(__name__)


@dataclass
class AudioMuseData:
    """Snapshot of an AudioMuse-AI server."""

    version: str
    summary: Summary
    servers: list[MusicServer] = field(default_factory=list)

    @property
    def default_server(self) -> MusicServer | None:
        """The music server AudioMuse-AI creates playlists on."""
        for server in self.servers:
            if server.is_default:
                return server
        return self.servers[0] if self.servers else None


class AudioMuseCoordinator(DataUpdateCoordinator[AudioMuseData]):
    """Fetch version, library statistics and music servers."""

    config_entry: ConfigEntry

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, client: AudioMuseClient) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=SCAN_INTERVAL,
        )
        self.client = client

    async def _async_update_data(self) -> AudioMuseData:
        try:
            version = await self.client.get_version()
            summary = await self.client.get_summary()
            servers = await self.client.get_servers()
        except AudioMuseAuthError as err:
            raise ConfigEntryAuthFailed(str(err)) from err
        except AudioMuseError as err:
            raise UpdateFailed(str(err)) from err
        return AudioMuseData(version=version, summary=summary, servers=servers)
