# AudioMuse-AI for Home Assistant

A Home Assistant integration for [AudioMuse-AI](https://github.com/NeptuneHub/AudioMuse-AI). It brings AudioMuse-AI's sonic-analysis playlists into Home Assistant and plays them on your speakers through [Music Assistant](https://www.music-assistant.io/).

> **Status: early development (0.1.0).** The actions and sensors below work; the AudioMuse page for the Home Assistant sidebar is the next step.

## What it does

- **Instant Playlist:** describe what you want ("upbeat 90s indie for a Sunday morning"). AudioMuse-AI's AI picks songs from *your* library and saves them as a playlist on your music server, so it shows up in every client app. It can also start it on a speaker straight away.
- **Similar artists:** find artists in your library that sound like one you name.
- **Artist playlist:** a mix of one artist plus the artists that sound most like them.
- **Playlist ideas:** AudioMuse-AI's own suggested prompts.
- **Radios:** refresh your saved AudioMuse-AI Radios into playlists.
- **Sensors:** songs, albums and artists analysed, busy workers, queued tasks, version.

Every action returns its result as response data, so you can use them in automations, scripts and voice commands.

## Requirements

- AudioMuse-AI **3.7.1 or newer**, reachable from Home Assistant, with its API token.
- For Instant Playlist: an AI provider configured **in AudioMuse-AI** (OpenAI-compatible, Ollama, Gemini or Mistral). Choose a model that supports tool calling; AudioMuse-AI requires it. Your AI key stays in AudioMuse-AI.
- For playback: the Music Assistant integration, with your music server added as a Music Assistant provider.

## Installation (HACS)

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/colfin22/ha-audiomuse` as an **Integration**.
2. Install **AudioMuse-AI** and restart Home Assistant.
3. **Settings → Devices & services → Add integration → AudioMuse-AI**, then enter the server URL and API token.

## Options

| Option | What it is for |
|---|---|
| Songs per playlist | Default song count for actions that don't give one. |
| Default speaker | A Music Assistant speaker for playback when none is chosen. |
| AI provider / model / server URL | Override AudioMuse-AI's own AI settings for Instant Playlist. Leave empty to use AudioMuse-AI's. |
| Music Assistant provider | Rarely needed: Navidrome, Jellyfin, Emby and Plex are detected automatically. Set it to a Music Assistant provider instance ID if playback fails or you have several providers of the same kind. |

## Example: make and play a playlist from an automation

```yaml
action: audiomuse.instant_playlist
data:
  prompt: "Relaxed acoustic songs for a rainy afternoon"
  count: 20
  play_on: media_player.kitchen
response_variable: playlist
```

`playlist.tracks` holds the songs, and `playlist.playlist_name` the saved name. AudioMuse-AI adds `_instant` to playlist names.

## Music servers

Everything except playback works with every music server AudioMuse-AI supports, because AudioMuse-AI does the work and saves playlists to your server itself. Playback on a speaker goes through Music Assistant, so it depends on Music Assistant having a provider for your server:

| Music server | Playlists, artists, ideas, Radios, sensors | Play on a speaker (Music Assistant) |
|---|---|---|
| Navidrome | ✅ | ✅ tested |
| Jellyfin | ✅ | 🧪 should work, not yet tested |
| Emby | ✅ | 🧪 should work, not yet tested |
| Plex | ✅ | 🧪 should work, not yet tested |
| Lyrion | ✅ | ❌ Music Assistant has no Lyrion music provider |

🧪 = built from the Music Assistant provider source but not yet confirmed on a real server. **If you use Jellyfin, Emby or Plex, please try playback and report the result in an issue.** It helps everyone.

A playlist made a moment ago plays straight away: the integration asks Music Assistant for it by its music-server ID, so it doesn't wait for a Music Assistant library sync. If you have more than one Music Assistant provider for the same kind of server, set the **Music Assistant provider** option to the instance you want.

## How this relates to Music Assistant's AudioMuse-AI plugin

Music Assistant has its own AudioMuse-AI plugin (similar tracks, an "Inspired by recently played" row and free-text search, inside Music Assistant). This integration is complementary: it brings AI Instant Playlists, artist playlists, playlist ideas, Radios, sensors and Home Assistant actions into Home Assistant itself. You can use both.

## Notes

- The integration never changes AudioMuse-AI's settings.

## Licence

MIT
