"""Shared fixtures data for Home Assistant tests (generic sample data only)."""

from custom_components.audiomuse.api import (
                  Artist,
                  InstantPlaylist,
                  MusicServer,
                  SavedPlaylist,
                  Summary,
                  Track,
)

URL = "http://audiomuse.test:8000"
TOKEN = "test-token"

SUMMARY = Summary(songs_analysed=1200, albums=90, artists=40, unanalysable=3, busy_workers=1, workers=2,
                  busy_task_types=["album_analysis"], queue_pending=5, queue_running=1)
SERVERS = [MusicServer(server_id="s1", name="Home music", server_type="navidrome", is_default=True)]
TRACKS = [Track("t1", "One", "Alice", "A"), Track("t2", "Two", "Bob", "B")]
INSTANT = InstantPlaylist(tracks=TRACKS, message="done", ai_provider="OPENAI", ai_model="some-model")
SAVED = SavedPlaylist(playlist_id="pl1", message="Successfully created playlist 'Rainy day' on the media server with ID: pl1")
SIMILAR = [Artist("Bob", "b1", 30, 0.1), Artist("Carol", "c1", 12, 0.2)]
