"""Tests for the HA-free playlist helpers."""

import random

from custom_components.audiomuse.api import Track
from custom_components.audiomuse.playlist import mix_tracks, playlist_name_from


def _tracks(artist, n, prefix=None):
    return [Track(item_id=f"{prefix or artist}{i}", title=f"Song {i}", artist=artist) for i in range(n)]


def test_mix_interleaves_artists():
    pools = [_tracks("alice", 5), _tracks("bob", 5), _tracks("carol", 5)]
    out = mix_tracks(pools, 6, random.Random(1))
    assert len(out) == 6
    assert [t.artist for t in out[:3]] == ["alice", "bob", "carol"]
    assert [t.artist for t in out[3:]] == ["alice", "bob", "carol"]


def test_mix_never_repeats_and_stops_when_out_of_songs():
    shared = _tracks("alice", 2, prefix="x")
    pools = [shared, list(shared), _tracks("bob", 1)]
    out = mix_tracks(pools, 50, random.Random(2))
    ids = [t.item_id for t in out]
    assert len(ids) == len(set(ids)) == 3


def test_mix_skips_empty_pools():
    assert mix_tracks([[], _tracks("bob", 2), []], 5, random.Random(3))[0].artist == "bob"
    assert mix_tracks([], 5) == []


def test_playlist_name_from():
    assert playlist_name_from("  upbeat   90s indie! ") == "Upbeat 90s indie"
    long = "songs for a very long drive across the country with the windows down and the volume up"
    name = playlist_name_from(long)
    assert len(name) <= 60 and not name.endswith(" ")
    assert playlist_name_from("   ") == "AudioMuse playlist"
