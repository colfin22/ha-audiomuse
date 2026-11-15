"""Tests for the AudioMuse-AI HTTP client (response shapes from AudioMuse-AI 3.7.1)."""

import aiohttp
import pytest
from aioresponses import aioresponses
from yarl import URL as aiohttp_url

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


async def test_similar_artists_why_similar(client):
    """With why=True AudioMuse-AI is asked for component matches, and the
    closest pair of songs is kept as "sounds alike"."""
    with aioresponses() as m:
        m.get(
            f"{URL}/api/similar_artists?artist=Alice&include_component_matches=true&n=3",
            payload=[{
                "artist": "Bob", "artist_id": "b1", "divergence": 0.12, "track_count": 30,
                "component_matches": [
                    {
                        "artist1_representative_songs": [{"item_id": "a9", "title": "Alice Song"}],
                        "artist2_representative_songs": [{"item_id": "b9", "title": "Bob Song"}],
                        "distance": 0.01,
                    },
                    {
                        "artist1_representative_songs": [{"item_id": "a8", "title": "Other"}],
                        "artist2_representative_songs": [{"item_id": "b8", "title": "Other Bob"}],
                        "distance": 0.2,
                    },
                ],
            }],
        )
        artists = await client.similar_artists(artist="Alice", count=3, why=True)
    assert artists[0].sounds_alike == ("Alice Song", "Bob Song")
    assert artists[0].as_dict()["sounds_alike"] == {"artist_song": "Alice Song", "similar_song": "Bob Song"}


async def test_similar_artists_without_why_has_no_sounds_alike(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/similar_artists?artist=Alice&n=3", payload=[{"artist": "Bob", "artist_id": "b1"}])
        artists = await client.similar_artists(artist="Alice", count=3)
    assert artists[0].sounds_alike is None
    assert artists[0].as_dict()["sounds_alike"] is None


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


async def test_no_token_sends_no_auth_header():
    async with aiohttp.ClientSession() as session:
        client = AudioMuseClient(session, URL, "")
        with aioresponses() as m:
            m.get(f"{URL}/api/version", payload={"app_version": "v3.7.1"})
            await client.get_version()
            headers = next(iter(m.requests.values()))[0].kwargs["headers"]
    assert "Authorization" not in headers


async def test_lyrics_stats(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/lyrics/stats", payload={"lyrics_enabled": True, "song_count": 420, "loaded": True})
        stats = await client.get_lyrics_stats()
    assert stats.enabled and stats.songs == 420 and stats.available


async def test_lyrics_enabled_but_nothing_analysed_is_not_available(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/lyrics/stats", payload={"lyrics_enabled": True, "song_count": 0})
        stats = await client.get_lyrics_stats()
    assert stats.enabled and not stats.available


async def test_search_tracks(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/search_tracks?search_query=There+Goes",
            payload=[{"item_id": "s1", "title": "There Goes the Fear", "author": "Doves", "album": "The Last Broadcast"}],
        )
        tracks = await client.search_tracks("There Goes")
    assert tracks[0].item_id == "s1"
    assert tracks[0].artist == "Doves"
    assert tracks[0].album == "The Last Broadcast"


async def test_similar_tracks_from_a_song(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/similar_tracks?eliminate_duplicates=true&item_id=s1&n=5&radius_similarity=false",
            payload=[{"item_id": "t1", "title": "Pounding", "author": "Doves", "distance": 0.02}],
        )
        tracks = await client.similar_tracks(item_id="s1", count=5, limit_per_artist=True, radius_similarity=False)
    assert [t.item_id for t in tracks] == ["t1"]


async def test_similar_tracks_from_an_anchor(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/similar_tracks?anchor_id=3&eliminate_duplicates=true&n=25&radius_similarity=true",
            payload=[{"item_id": "t2", "title": "Two", "author": "B"}],
        )
        tracks = await client.similar_tracks(anchor_id=3)
    assert tracks[0].item_id == "t2"


async def test_similar_tracks_needs_a_song_or_anchor(client):
    with pytest.raises(ValueError):
        await client.similar_tracks()


async def test_anchors(client):
    with aioresponses() as m:
        m.get(f"{URL}/api/anchors", payload={"anchors": [{"id": 3, "name": "Post-rock calm"}]})
        assert await client.get_anchors() == [{"id": 3, "name": "Post-rock calm"}]


async def test_find_path_between_two_songs(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/find_path?end_song_id=e1&max_steps=10&path_fix_size=true&start_song_id=s1",
            payload={"path": [
                {"item_id": "s1", "title": "Start", "author": "A", "embedding_vector": [0.1] * 200},
                {"item_id": "e1", "title": "End", "author": "B"},
            ], "total_distance": 0.9},
        )
        tracks = await client.find_path(start_song="s1", end_song="e1", count=10, exact=True)
    assert [t.item_id for t in tracks] == ["s1", "e1"]
    assert "embedding_vector" not in tracks[0].as_dict()


async def test_find_path_mood_lyrics_and_anchor_params(client):
    with aioresponses() as m:
        m.get(
            f"{URL}/api/find_path?end_mood=relaxed&max_steps=25&path_fix_size=false&start_song_id=s1",
            payload={"path": []},
        )
        m.get(
            f"{URL}/api/find_path?end_song_id=e1&max_steps=25&path_fix_size=true&path_space=lyrics&start_song_id=s1",
            payload={"path": []},
        )
        m.get(
            f"{URL}/api/find_path?end_song_id=e1&max_steps=25&path_fix_size=true&start_anchor=4",
            payload={"path": []},
        )
        assert await client.find_path(start_song="s1", end_mood="relaxed", exact=False) == []
        assert await client.find_path(start_song="s1", end_song="e1", lyrics=True) == []
        assert await client.find_path(start_anchor=4, end_song="e1") == []


@pytest.mark.parametrize(
    "kwargs",
    [
        {"start_song": "s1"},  # no end
        {"end_song": "e1"},  # no start
        {"start_song": "s1", "start_mood": "happy", "end_song": "e1"},  # two starts
        {"start_mood": "happy", "end_mood": "sad"},  # mood at both ends
        {"start_anchor": 1, "end_mood": "sad"},  # mood/anchor at both ends
        {"start_song": "s1", "end_mood": "sad", "lyrics": True},  # lyrics needs two songs
        {"start_song": "s1", "end_mood": "sleepy"},  # not one of AudioMuse-AI's path moods
    ],
)
async def test_find_path_rejects_combinations_audiomuse_does_not_allow(client, kwargs):
    with pytest.raises(ValueError):
        await client.find_path(**kwargs)


ALCHEMY_ANSWER = {
    "results": [{"item_id": "r1", "title": "Result", "author": "R", "embedding_vector": [0.0] * 200}],
    "add_centroid_vector": [0.1, 0.2],
    "inclusions": [{"vector": [0.1, 0.2], "weight": 1.0}],
    "exclusions": [{"vector": [0.3, 0.4], "radius": 0.3}],
    "inclusions_embedding": {"dimension": 2},
    "add_points": [{"big": "map data"}],
    "filtered_out": [{"item_id": "x1"}, {"item_id": "x2"}],
}


async def test_alchemy_sends_items_and_keeps_the_blend(client):
    with aioresponses() as m:
        m.post(f"{URL}/api/alchemy", payload=ALCHEMY_ANSWER)
        result = await client.alchemy(
            [{"type": "artist", "id": "Mogwai", "op": "ADD"}, {"type": "song", "id": "s9", "op": "SUBTRACT"}],
            count=25, temperature=0.5, subtract_distance=0.3,
        )
        sent = m.requests[("POST", aiohttp_url(f"{URL}/api/alchemy"))][0].kwargs["json"]
    assert sent == {
        "items": [{"type": "artist", "id": "Mogwai", "op": "ADD"}, {"type": "song", "id": "s9", "op": "SUBTRACT"}],
        "n": 25, "temperature": 0.5, "subtract_distance": 0.3,
    }
    assert [t.item_id for t in result.tracks] == ["r1"]
    assert result.removed == 2
    assert result.blend == {
        "centroid": [0.1, 0.2],
        "inclusions": [{"vector": [0.1, 0.2], "weight": 1.0}],
        "exclusions": [{"vector": [0.3, 0.4], "radius": 0.3}],
        "inclusions_embedding": {"dimension": 2},
    }


async def test_alchemy_leaves_out_subtract_distance_when_not_given(client):
    with aioresponses() as m:
        m.post(f"{URL}/api/alchemy", payload=ALCHEMY_ANSWER)
        await client.alchemy([{"type": "song", "id": "s1", "op": "ADD"}], count=10, temperature=1.0)
        sent = m.requests[("POST", aiohttp_url(f"{URL}/api/alchemy"))][0].kwargs["json"]
    assert "subtract_distance" not in sent


async def test_alchemy_needs_an_include(client):
    with pytest.raises(ValueError):
        await client.alchemy([{"type": "song", "id": "s1", "op": "SUBTRACT"}])


async def test_save_rename_delete_anchor(client):
    blend = {"centroid": [0.1], "inclusions": [], "exclusions": [], "inclusions_embedding": None}
    with aioresponses() as m:
        m.post(f"{URL}/api/anchors", payload={"anchor": {"id": 7, "name": "Calm"}, "dropped_points": {}})
        m.put(f"{URL}/api/anchors/7", payload={"anchor": {"id": 7, "name": "Calmer"}})
        m.delete(f"{URL}/api/anchors/7", payload={"deleted": True})
        assert await client.save_anchor("Calm", blend) == {"id": 7, "name": "Calm"}
        sent = m.requests[("POST", aiohttp_url(f"{URL}/api/anchors"))][0].kwargs["json"]
        await client.rename_anchor(7, "Calmer")
        renamed = m.requests[("PUT", aiohttp_url(f"{URL}/api/anchors/7"))][0].kwargs["json"]
        await client.delete_anchor(7)
    assert sent == {"name": "Calm", **blend}
    assert renamed == {"name": "Calmer"}


async def test_add_update_delete_radio(client):
    with aioresponses() as m:
        m.post(f"{URL}/api/radios", payload={"radio": {"id": 3}})
        m.put(f"{URL}/api/radios/3", payload={"radio": {"id": 3}})
        m.delete(f"{URL}/api/radios/3", payload={"deleted": True})
        await client.add_radio(7, temperature=0.5, songs=40, enabled=True)
        added = m.requests[("POST", aiohttp_url(f"{URL}/api/radios"))][0].kwargs["json"]
        await client.update_radio(3, enabled=False)
        updated = m.requests[("PUT", aiohttp_url(f"{URL}/api/radios/3"))][0].kwargs["json"]
        await client.delete_radio(3)
    assert added == {"anchor_id": 7, "temperature": 0.5, "n_results": 40, "enabled": True}
    assert updated == {"enabled": False}
