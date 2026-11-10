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
| Music Assistant provider | Only needed if playback fails. Navidrome is detected automatically; for other music servers enter the Music Assistant provider (instance) ID. |

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

## Notes

- A playlist made a moment ago plays straight away: the integration asks Music Assistant for it by its music-server ID, so it doesn't have to wait for a Music Assistant library sync. This is verified with Navidrome; other music servers may need the **Music Assistant provider** option.
- The integration never changes AudioMuse-AI's settings.

## Licence

MIT
