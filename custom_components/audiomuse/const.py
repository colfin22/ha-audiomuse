"""Constants for the AudioMuse-AI integration."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "audiomuse"

CONF_DEFAULT_COUNT: Final = "default_count"
CONF_AI_PROVIDER: Final = "ai_provider"
CONF_AI_MODEL: Final = "ai_model"
CONF_AI_SERVER_URL: Final = "ai_server_url"
CONF_DEFAULT_PLAYER: Final = "default_player"
CONF_MA_PROVIDER: Final = "music_assistant_provider"

DEFAULT_COUNT: Final = 25
MIN_COUNT: Final = 5
MAX_COUNT: Final = 200

# The oldest AudioMuse-AI release this integration has been tested against.
MIN_VERSION: Final = (3, 7, 1)

SCAN_INTERVAL: Final = timedelta(minutes=5)

# AI providers AudioMuse-AI accepts (an empty choice means "use the server's setting").
AI_PROVIDERS: Final = ["OPENAI", "OLLAMA", "GEMINI", "MISTRAL"]

# AudioMuse-AI music-server type -> Music Assistant provider domain, used to build
# "<domain>://playlist/<id>" so a brand-new playlist plays without waiting for a
# Music Assistant library sync. Only verified pairs belong here; any other server
# type needs the "Music Assistant provider" option set by the user.
MA_PROVIDER_BY_SERVER_TYPE: Final = {
    "navidrome": "opensubsonic",
}

MUSIC_ASSISTANT_DOMAIN: Final = "music_assistant"

# Service names
SERVICE_INSTANT_PLAYLIST: Final = "instant_playlist"
SERVICE_SIMILAR_ARTISTS: Final = "similar_artists"
SERVICE_ARTIST_PLAYLIST: Final = "artist_playlist"
SERVICE_PLAYLIST_IDEAS: Final = "playlist_ideas"
SERVICE_RUN_RADIOS: Final = "run_radios"
SERVICE_PLAY_PLAYLIST: Final = "play_playlist"

ATTR_CONFIG_ENTRY_ID: Final = "config_entry_id"
ATTR_PROMPT: Final = "prompt"
ATTR_COUNT: Final = "count"
ATTR_NAME: Final = "name"
ATTR_SAVE: Final = "save"
ATTR_PLAY_ON: Final = "play_on"
ATTR_ARTIST: Final = "artist"
ATTR_PLAYLIST_ID: Final = "playlist_id"
ATTR_INCLUDE_SIMILAR: Final = "include_similar"
