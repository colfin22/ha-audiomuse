"""Async client for the AudioMuse-AI HTTP API.

This module deliberately has no Home Assistant imports so it can be tested
on its own. Every method maps to one AudioMuse-AI endpoint.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

import aiohttp

DEFAULT_TIMEOUT = 30
AI_TIMEOUT = 180

_PLAYLIST_ID_RE = re.compile(r"with ID:\s*(\S+?)\.?\s*$")


class AudioMuseError(Exception):
    """Base error for the AudioMuse-AI client."""


class AudioMuseConnectionError(AudioMuseError):
    """AudioMuse-AI could not be reached or did not answer in time."""


class AudioMuseAuthError(AudioMuseError):
    """The API token was rejected."""


class AudioMuseResponseError(AudioMuseError):
    """AudioMuse-AI answered, but with an error or an unusable result."""

    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status


@dataclass(frozen=True)
class Track:
    """A song known to AudioMuse-AI and the music server."""

    item_id: str
    title: str
    artist: str
    album: str | None = None

    def as_dict(self) -> dict[str, Any]:
        """Return a JSON-friendly dict."""
        return {
            "item_id": self.item_id,
            "title": self.title,
            "artist": self.artist,
            "album": self.album,
        }


@dataclass(frozen=True)
class Artist:
    """An artist match, optionally with a similarity divergence (lower = closer)."""

    name: str
    artist_id: str | None
    track_count: int | None = None
    divergence: float | None = None

    def as_dict(self) -> dict[str, Any]:
        """Return a JSON-friendly dict."""
        return {
            "name": self.name,
            "artist_id": self.artist_id,
            "track_count": self.track_count,
            "divergence": self.divergence,
        }


@dataclass(frozen=True)
class MusicServer:
    """A music server configured in AudioMuse-AI (credentials are never kept)."""

    server_id: str
    name: str
    server_type: str
    is_default: bool


@dataclass(frozen=True)
class InstantPlaylist:
    """The result of an AI Instant Playlist request."""

    tracks: list[Track]
    message: str | None = None
    ai_provider: str | None = None
    ai_model: str | None = None
    executed_query: str | None = None


@dataclass(frozen=True)
class SavedPlaylist:
    """A playlist created on the music server."""

    playlist_id: str | None
    message: str


@dataclass
class Summary:
    """The parts of the AudioMuse-AI dashboard summary we expose."""

    songs_analysed: int | None = None
    albums: int | None = None
    artists: int | None = None
    unanalysable: int | None = None
    busy_workers: int = 0
    workers: int = 0
    busy_task_types: list[str] = field(default_factory=list)
    queue_pending: int = 0
    queue_running: int = 0


def parse_version(value: str) -> tuple[int, ...]:
    """Parse 'v3.7.1' or '3.7.1-nvidia' into (3, 7, 1). Unknown parts are dropped."""
    parts: list[int] = []
    for piece in value.strip().lstrip("vV").split("."):
        match = re.match(r"\d+", piece)
        if not match:
            break
        parts.append(int(match.group()))
    return tuple(parts)


def parse_playlist_id(message: str) -> str | None:
    """Pull the playlist ID out of AudioMuse-AI's create-playlist message.

    AudioMuse-AI only returns the ID inside its message text, for example
    "Successfully created playlist 'X' on the media server with ID: abc123".
    """
    match = _PLAYLIST_ID_RE.search(message or "")
    return match.group(1) if match else None


def parse_summary(payload: dict[str, Any]) -> Summary:
    """Turn the /api/dashboard/summary payload into a Summary."""
    content = payload.get("content") or {}
    workers = payload.get("workers") or []
    busy = [w for w in workers if (w.get("state") or "").lower() == "busy"]
    backlog = payload.get("queue_backlog") or []
    return Summary(
        songs_analysed=content.get("total_songs"),
        albums=content.get("distinct_albums"),
        artists=content.get("distinct_artists"),
        unanalysable=content.get("unanalyzable_tracks"),
        busy_workers=len(busy),
        workers=len(workers),
        busy_task_types=sorted(
            {w["current_task_type"] for w in busy if w.get("current_task_type")}
        ),
        queue_pending=sum(int(q.get("pending_count") or 0) for q in backlog),
        queue_running=sum(int(q.get("running_count") or 0) for q in backlog),
    )


class AudioMuseClient:
    """Talk to one AudioMuse-AI server."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        url: str,
        token: str,
        *,
        request_timeout: float = DEFAULT_TIMEOUT,
    ) -> None:
        self._session = session
        self._url = url.rstrip("/")
        self._token = token
        self._timeout = request_timeout

    @property
    def url(self) -> str:
        """The server URL, without a trailing slash."""
        return self._url

    async def _request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
        timeout: float | None = None,
    ) -> Any:
        headers = {"Authorization": f"Bearer {self._token}", "Accept": "application/json"}
        if params:
            params = {k: v for k, v in params.items() if v is not None}
        try:
            async with self._session.request(
                method,
                f"{self._url}{path}",
                params=params,
                json=json,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=timeout or self._timeout),
            ) as resp:
                if resp.status in (401, 403):
                    raise AudioMuseAuthError("AudioMuse-AI rejected the API token")
                try:
                    data = await resp.json(content_type=None)
                except (aiohttp.ContentTypeError, ValueError):
                    data = None
                if resp.status >= 400:
                    raise AudioMuseResponseError(_error_message(data, resp.status), resp.status)
                return data
        except AudioMuseError:
            raise
        except TimeoutError as err:
            raise AudioMuseConnectionError(f"AudioMuse-AI did not answer within the timeout ({path})") from err
        except aiohttp.ClientError as err:
            raise AudioMuseConnectionError(f"Cannot reach AudioMuse-AI: {err}") from err

    async def get_version(self) -> str:
        """Return the server version, e.g. 'v3.7.1'."""
        data = await self._request("GET", "/api/version")
        version = (data or {}).get("app_version")
        if not version:
            raise AudioMuseResponseError("AudioMuse-AI did not report a version")
        return str(version)

    async def get_summary(self) -> Summary:
        """Return library and worker statistics."""
        return parse_summary(await self._request("GET", "/api/dashboard/summary") or {})

    async def get_servers(self) -> list[MusicServer]:
        """Return the configured music servers (types only, never credentials)."""
        data = await self._request("GET", "/api/servers") or {}
        return [
            MusicServer(
                server_id=str(s.get("server_id", "")),
                name=str(s.get("name", "")),
                server_type=str(s.get("server_type", "")).lower(),
                is_default=bool(s.get("is_default")),
            )
            for s in data.get("servers") or []
        ]

    async def search_artists(self, query: str) -> list[Artist]:
        """Search the analysed library for artists by name."""
        data = await self._request("GET", "/api/search_artists", params={"query": query}) or []
        return [_artist(a) for a in data]

    async def similar_artists(
        self, artist: str | None = None, artist_id: str | None = None, count: int = 10
    ) -> list[Artist]:
        """Return artists that sound similar to the given one."""
        if not artist and not artist_id:
            raise ValueError("artist or artist_id is required")
        data = await self._request(
            "GET",
            "/api/similar_artists",
            params={"artist": artist, "artist_id": artist_id, "n": count},
        ) or []
        return [_artist(a) for a in data]

    async def artist_tracks(
        self, artist: str | None = None, artist_id: str | None = None
    ) -> list[Track]:
        """Return the analysed tracks of one artist."""
        if not artist and not artist_id:
            raise ValueError("artist or artist_id is required")
        data = await self._request(
            "GET", "/api/artist_tracks", params={"artist": artist, "artist_id": artist_id}
        ) or []
        return [_track(t) for t in data]

    async def playlist_ideas(self) -> list[str]:
        """Return AudioMuse-AI's suggested search prompts."""
        data = await self._request("GET", "/api/clap/top_queries") or {}
        return [str(q) for q in data.get("queries") or []]

    async def get_radios(self) -> list[dict[str, Any]]:
        """Return the saved Radios."""
        data = await self._request("GET", "/api/radios") or {}
        return list(data.get("radios") or [])

    async def run_radios(self) -> dict[str, Any]:
        """Create or refresh one music-server playlist per enabled Radio."""
        return await self._request("POST", "/api/radios/run", json={}, timeout=AI_TIMEOUT) or {}

    async def instant_playlist(
        self,
        prompt: str,
        count: int,
        *,
        ai_provider: str | None = None,
        ai_model: str | None = None,
        ai_server_url: str | None = None,
    ) -> InstantPlaylist:
        """Ask AudioMuse-AI's AI to pick songs for a natural-language request.

        Provider and model fall back to the AudioMuse-AI server's own settings
        when not given. The AI key always stays on the AudioMuse-AI server.
        """
        body: dict[str, Any] = {"userInput": prompt, "n": count}
        if ai_provider:
            body["ai_provider"] = ai_provider
        if ai_model:
            body["ai_model"] = ai_model
        if ai_server_url:
            body["openai_server_url"] = ai_server_url
        data = await self._request("POST", "/chat/api/chatPlaylist", json=body, timeout=AI_TIMEOUT) or {}
        result = data.get("response") or {}
        tracks = [_track(t) for t in result.get("query_results") or [] if t.get("item_id")]
        if not tracks:
            raise AudioMuseResponseError(
                result.get("message") or "AudioMuse-AI returned no songs for that request"
            )
        return InstantPlaylist(
            tracks=tracks,
            message=result.get("message"),
            ai_provider=result.get("ai_provider_used"),
            ai_model=result.get("ai_model_selected"),
            executed_query=result.get("executed_query"),
        )

    async def save_playlist(self, name: str, item_ids: list[str]) -> SavedPlaylist:
        """Create a playlist on the music server from song IDs."""
        if not item_ids:
            raise ValueError("item_ids must not be empty")
        data = await self._request(
            "POST",
            "/chat/api/create_playlist",
            json={"playlist_name": name, "item_ids": list(item_ids)},
        ) or {}
        message = str(data.get("message") or "")
        return SavedPlaylist(playlist_id=parse_playlist_id(message), message=message)


def _error_message(data: Any, status: int) -> str:
    if isinstance(data, dict):
        for key in ("message", "error", "reason"):
            value = data.get(key)
            if isinstance(value, str) and value:
                return value
            if isinstance(value, dict) and value.get("message"):
                return str(value["message"])
    return f"AudioMuse-AI returned HTTP {status}"


def _track(raw: dict[str, Any]) -> Track:
    return Track(
        item_id=str(raw.get("item_id", "")),
        title=str(raw.get("title") or ""),
        artist=str(raw.get("artist") or raw.get("author") or ""),
        album=raw.get("album") or None,
    )


def _artist(raw: dict[str, Any]) -> Artist:
    divergence = raw.get("divergence")
    track_count = raw.get("track_count")
    return Artist(
        name=str(raw.get("artist") or raw.get("name") or ""),
        artist_id=raw.get("artist_id"),
        track_count=int(track_count) if track_count is not None else None,
        divergence=float(divergence) if divergence is not None else None,
    )
