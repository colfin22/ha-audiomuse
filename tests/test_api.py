"""Tests for the AudioMuse-AI HTTP client (response shapes from AudioMuse-AI 3.7.1)."""

import aiohttp
import pytest
from aioresponses import aioresponses

from custom_components.audiomuse.api import (
    AudioMuseAuthError,
    AudioMuseClient,
    AudioMuseConnectionError,
    AudioMuseResponseError,
    parse_playlist_id,
    parse_summary,
    parse_version,
)

URL = "http://audiomuse.test:8000"


@pytest.fixture
async def client():
    async with aiohttp.ClientSession() as session:
        yield AudioMuseClient(session, URL + "/", "secret-token")


@pytest.mark.parametrize(
    ("raw", "expected"),
    [("v3.7.1", (3, 7, 1)), ("3.8.0-nvidia", (3, 8, 0)), ("v4", (4,)), ("dev", ())],
)
def test_parse_version(raw, expected):
    assert parse_version(raw) == expected


def test_parse_playlist_id():
    msg = "Successfully created playlist 'Rainy day' on the media server with ID: pLExampleId0123456789x"
    assert parse_playlist_id(msg) == "pLExampleId0123456789x"
    assert parse_playlist_id("Playlist created.") is None
    assert parse_playlist_id("") is None


def test_parse_summary():
    payload = {
        "content": {"total_songs": 1200, "distinct_albums": 90, "distinct_artists": 40, "unanalyzable_tracks": 3},
        "workers": [
            {"state": "busy", "current_task_type": "album_analysis"},
            {"state": "idle", "current_task_type": None},
        ],
        "queue_backlog": [
            {"queue_name": "default", "pending_count": 5, "running_count": 1},
            {"queue_name": "high", "pending_count": 0, "running_count": 1},
        ],
    }
    s = parse_summary(payload)
    assert (s.songs_analysed, s.albums, s.artists, s.unanalysable) == (1200, 90, 40, 3)
    assert (s.busy_workers, s.workers, s.busy_task_types) == (1, 2, ["album_analysis"])
    assert (s.queue_pending, s.queue_running) == (5, 2)
    assert parse_summary({}).songs_analysed is None


async def test_version_sends_token_and_strips_slash(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/version", payload={"app_version": "v3.7.1"})
        assert await client.get_version() == "v3.7.1"
        request = next(iter(m.requests.values()))[0]
        assert request.kwargs["headers"]["Authorization"] == "Bearer secret-token"


async def test_auth_error(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/version", status=401)
        with pytest.raises(AudioMuseAuthError):
            await client.get_version()


async def test_connection_error(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/version", exception=aiohttp.ClientConnectionError("refused"))
        with pytest.raises(AudioMuseConnectionError):
            await client.get_version()


async def test_timeout_is_connection_error(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/version", exception=TimeoutError())
        with pytest.raises(AudioMuseConnectionError):
            await client.get_version()


async def test_http_error_uses_server_message(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/radios", status=500, payload={"message": "database busy"})
        with pytest.raises(AudioMuseResponseError, match="database busy") as err:
            await client.get_radios()
        assert err.value.status == 500


async def test_servers_never_keep_credentials(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/servers",
            payload={
                "servers": [
                    {"server_id": "abc", "name": "Home", "server_type": "Navidrome", "is_default": True,
                     "creds": {"user": "alice", "password": "hunter2"}}
                ]
            },
        )
        servers = await client.get_servers()
    assert len(servers) == 1
    assert servers[0].server_type == "navidrome"
    assert servers[0].is_default
    assert not hasattr(servers[0], "creds")


async def test_similar_artists_params_and_shape(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/similar_artists?artist=Alice&n=3",
            payload=[{"artist": "Bob", "artist_id": "b1", "divergence": 0.12, "track_count": 30}],
        )
        artists = await client.similar_artists(artist="Alice", count=3)
    assert artists[0].name == "Bob"
    assert artists[0].divergence == pytest.approx(0.12)
    assert artists[0].track_count == 30


async def test_similar_artists_needs_an_artist(client):
    with pytest.raises(ValueError):
        await client.similar_artists()


async def test_artist_tracks_maps_author(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/artist_tracks?artist=Alice", payload=[{"author": "Alice", "item_id": "t1", "title": "One"}])
        tracks = await client.artist_tracks(artist="Alice")
    assert tracks[0].artist == "Alice"
    assert tracks[0].item_id == "t1"


async def test_playlist_ideas(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/clap/top_queries", payload={"queries": ["groovy sax blues", "calm piano"], "ready": True})
        assert await client.playlist_ideas() == ["groovy sax blues", "calm piano"]


async def test_instant_playlist(client):
    with aioresponses() as m:
        m.post(
            f"{URL}/chat/api/chatPlaylist",
            payload={
                "response": {
                    "ai_model_selected": "some-model",
                    "ai_provider_used": "OPENAI",
                    "executed_query": "q",
                    "message": "done",
                    "original_request": "rainy day",
                    "query_results": [
                        {"album": "A", "artist": "Alice", "item_id": "t1", "title": "One"},
                        {"album": "B", "artist": "Bob", "item_id": "t2", "title": "Two"},
                    ],
                }
            },
        )
        result = await client.instant_playlist("rainy day", 2, ai_model="some-model")
        body = next(iter(m.requests.values()))[0].kwargs["json"]
    assert body == {"userInput": "rainy day", "n": 2, "ai_model": "some-model"}
    assert [t.item_id for t in result.tracks] == ["t1", "t2"]
    assert result.ai_provider == "OPENAI"


async def test_instant_playlist_without_songs_is_an_error(client):
    with aioresponses() as m:
        m.post(f"{URL}/chat/api/chatPlaylist", payload={"response": {"message": "AI provider not configured", "query_results": []}})
        with pytest.raises(AudioMuseResponseError, match="not configured"):
            await client.instant_playlist("anything", 10)


async def test_save_playlist_parses_id(client):
    with aioresponses() as m:
        m.post(
            f"{URL}/chat/api/create_playlist",
            payload={"message": "Successfully created playlist 'Rainy' on the media server with ID: pl123"},
        )
        saved = await client.save_playlist("Rainy", ["t1", "t2"])
        body = next(iter(m.requests.values()))[0].kwargs["json"]
    assert saved.playlist_id == "pl123"
    assert body == {"playlist_name": "Rainy", "item_ids": ["t1", "t2"]}


async def test_save_playlist_needs_tracks(client):
    with pytest.raises(ValueError):
        await client.save_playlist("Empty", [])


async def test_text_search_maps_author_and_limit(client):
    with aioresponses() as m:
        m.post(
            f"{URL}/api/clap/search",
            payload={"query": "calm piano", "count": 1, "results": [
                {"item_id": "t9", "title": "Nocturne", "author": "Alice", "album": "Night", "similarity": 0.4}]},
        )
        tracks = await client.text_search("calm piano", 10)
        body = next(iter(m.requests.values()))[0].kwargs["json"]
    assert body == {"query": "calm piano", "limit": 10}
    assert tracks[0].artist == "Alice" and tracks[0].album == "Night"


async def test_text_search_no_results_is_an_error(client):
    with aioresponses() as m:
        m.post(f"{URL}/api/clap/search", payload={"query": "x", "count": 0, "results": []})
        with pytest.raises(AudioMuseResponseError, match="no songs"):
            await client.text_search("x", 10)


async def test_not_ready_503_is_explained(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/similar_artists?artist=Alice&n=10", status=503, payload={"message": "IVF index not loaded"})
        with pytest.raises(AudioMuseResponseError, match="isn't ready for this yet.*IVF index not loaded"):
            await client.similar_artists(artist="Alice")


async def test_ai_provider(client):
    with aioresponses() as m:
        m.get(f"{URL}/chat/api/config_defaults", payload={"default_ai_provider": "none"})
        assert await client.get_ai_provider() == "NONE"
