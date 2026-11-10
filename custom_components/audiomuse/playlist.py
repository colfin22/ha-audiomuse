"""Playlist helpers with no Home Assistant imports (unit-testable on their own)."""

from __future__ import annotations

import random
import re

from .api import Track


def playlist_name_from(prompt: str, limit: int = 60) -> str:
    """A tidy playlist name from a free-text request."""
    name = re.sub(r"\s+", " ", prompt).strip().strip(".!?")
    if len(name) > limit:
        name = name[:limit].rsplit(" ", 1)[0].rstrip(",;:-")
    return name[:1].upper() + name[1:] if name else "AudioMuse playlist"


def mix_tracks(pools: list[list[Track]], count: int, rng: random.Random | None = None) -> list[Track]:
    """Interleave tracks from several artists: round-robin over shuffled pools, no repeats."""
    rng = rng or random.Random()
    shuffled = [rng.sample(pool, len(pool)) for pool in pools if pool]
    out: list[Track] = []
    seen: set[str] = set()
    while shuffled and len(out) < count:
        for pool in list(shuffled):
            while pool and pool[0].item_id in seen:
                pool.pop(0)
            if not pool:
                shuffled.remove(pool)
                continue
            track = pool.pop(0)
            seen.add(track.item_id)
            out.append(track)
            if len(out) >= count:
                break
    return out
