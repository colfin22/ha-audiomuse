/**
 * AudioMuse sidebar page for Home Assistant.
 *
 * Home Assistant sets `hass`, `narrow`, `route` and `panel` on this element.
 * All data comes from the integration's websocket commands (audiomuse/*).
 */
import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";

interface Entry {
  entry_id: string;
  title: string;
  version: string | null;
  music_server: string | null;
  music_server_type: string | null;
  playback: boolean;
  playback_verified: boolean;
  default_count: number;
  default_player: string | null;
  songs_analysed: number | null;
  albums: number | null;
  busy_workers: number;
}

interface Player {
  entity_id: string;
  name: string;
  state: string | null;
}

interface Info {
  entries: Entry[];
  players: Player[];
  music_assistant: boolean;
  min_count: number;
  max_count: number;
}

interface Track {
  item_id: string;
  title: string;
  artist: string;
  album: string | null;
}

interface Saved {
  playlist_id: string | null;
  playlist_name: string | null;
  played_on: string | null;
}

interface Hass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  language?: string;
}

type Busy = "" | "make" | "save" | "play";

const IDEAS_SHOWN = 12;
const LS_ENTRY = "audiomuse.entry";
const LS_PLAYER = "audiomuse.player";

/** Same rule as the integration's playlist_name_from(), so names match automations. */
export function nameFromPrompt(prompt: string, limit = 60): string {
  let name = prompt.replace(/\s+/g, " ").trim().replace(/^[.!?]+|[.!?]+$/g, "");
  if (name.length > limit) {
    const cut = name.slice(0, limit);
    name = (cut.includes(" ") ? cut.slice(0, cut.lastIndexOf(" ")) : cut).replace(/[,;:-]+$/, "");
  }
  return name ? name[0].toUpperCase() + name.slice(1) : "AudioMuse playlist";
}

function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function errorText(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) return String((err as { message: unknown }).message);
  return String(err);
}

class AudioMusePanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _info: { state: true },
    _entryId: { state: true },
    _prompt: { state: true },
    _count: { state: true },
    _name: { state: true },
    _nameTouched: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _tracks: { state: true },
    _model: { state: true },
    _saved: { state: true },
    _player: { state: true },
    _ideas: { state: true },
    _shownIdeas: { state: true },
    _ideasError: { state: true },
    _loadError: { state: true },
  };

  declare hass?: Hass;
  declare narrow: boolean;
  declare _info?: Info;
  declare _entryId: string;
  declare _prompt: string;
  declare _count: number;
  declare _name: string;
  declare _nameTouched: boolean;
  declare _busy: Busy;
  declare _error: string;
  declare _tracks: Track[] | null;
  declare _model: string | null;
  declare _saved: Saved | null;
  declare _player: string;
  declare _ideas: string[];
  declare _shownIdeas: string[];
  declare _ideasError: string;
  declare _loadError: string;

  private _loading = false;

  constructor() {
    super();
    this.narrow = false;
    this._entryId = "";
    this._prompt = "";
    this._count = 25;
    this._name = "";
    this._nameTouched = false;
    this._busy = "";
    this._error = "";
    this._tracks = null;
    this._model = null;
    this._saved = null;
    this._player = "";
    this._ideas = [];
    this._shownIdeas = [];
    this._ideasError = "";
    this._loadError = "";
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && !this._info && !this._loading) {
      void this._load();
    }
  }

  private get _entry(): Entry | undefined {
    return this._info?.entries.find((e) => e.entry_id === this._entryId);
  }

  private get _canPlay(): boolean {
    return Boolean(this._entry?.playback && this._info?.music_assistant && this._info.players.length);
  }

  private async _load(): Promise<void> {
    if (!this.hass) return;
    this._loading = true;
    try {
      const info = await this.hass.callWS<Info>({ type: "audiomuse/info" });
      this._info = info;
      const saved = localStorage.getItem(LS_ENTRY);
      const entry = info.entries.find((e) => e.entry_id === saved) ?? info.entries[0];
      if (entry) this._selectEntry(entry.entry_id, false);
      this._loadError = "";
    } catch (err) {
      this._loadError = errorText(err);
    } finally {
      this._loading = false;
    }
  }

  private _selectEntry(entryId: string, remember = true): void {
    const entry = this._info?.entries.find((e) => e.entry_id === entryId);
    if (!entry || !this._info) return;
    this._entryId = entryId;
    if (remember) localStorage.setItem(LS_ENTRY, entryId);
    this._count = entry.default_count;
    const players = this._info.players.map((p) => p.entity_id);
    const remembered = localStorage.getItem(LS_PLAYER);
    this._player =
      (remembered && players.includes(remembered) && remembered) ||
      (entry.default_player && players.includes(entry.default_player) && entry.default_player) ||
      players[0] ||
      "";
    this._tracks = null;
    this._saved = null;
    this._error = "";
    void this._loadIdeas();
  }

  private async _loadIdeas(): Promise<void> {
    if (!this.hass || !this._entryId) return;
    try {
      const res = await this.hass.callWS<{ ideas: string[] }>({ type: "audiomuse/ideas", entry_id: this._entryId });
      this._ideas = res.ideas;
      this._shownIdeas = shuffled(res.ideas).slice(0, IDEAS_SHOWN);
      this._ideasError = "";
    } catch (err) {
      this._ideasError = errorText(err);
    }
  }

  private _moreIdeas(): void {
    const current = new Set(this._shownIdeas);
    const fresh = shuffled(this._ideas.filter((i) => !current.has(i)));
    this._shownIdeas = (fresh.length >= IDEAS_SHOWN ? fresh : shuffled(this._ideas)).slice(0, IDEAS_SHOWN);
  }

  private async _make(prompt?: string): Promise<void> {
    if (prompt !== undefined) {
      this._prompt = prompt;
      this._nameTouched = false;
    }
    const text = this._prompt.trim();
    if (!text || !this.hass || this._busy) return;
    this._busy = "make";
    this._error = "";
    this._tracks = null;
    this._saved = null;
    try {
      const res = await this.hass.callWS<{ tracks: Track[]; ai_model: string | null }>({
        type: "audiomuse/instant",
        entry_id: this._entryId,
        prompt: text,
        count: this._count,
      });
      this._tracks = res.tracks;
      this._model = res.ai_model;
      if (!this._nameTouched) this._name = nameFromPrompt(text);
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._busy = "";
    }
  }

  private async _save(play: boolean): Promise<void> {
    if (!this.hass || !this._tracks?.length || this._busy) return;
    this._busy = play ? "play" : "save";
    this._error = "";
    try {
      const msg: Record<string, unknown> = {
        type: "audiomuse/save",
        entry_id: this._entryId,
        name: this._name.trim() || nameFromPrompt(this._prompt),
        item_ids: this._tracks.map((t) => t.item_id),
      };
      if (play && this._player) msg.play_on = this._player;
      this._saved = await this.hass.callWS<Saved>(msg);
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._busy = "";
    }
  }

  private async _playSaved(): Promise<void> {
    if (!this.hass || !this._saved?.playlist_id || !this._player || this._busy) return;
    this._busy = "play";
    this._error = "";
    try {
      await this.hass.callWS({
        type: "audiomuse/play",
        entry_id: this._entryId,
        playlist_id: this._saved.playlist_id,
        entity_id: this._player,
      });
      this._saved = { ...this._saved, played_on: this._player };
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._busy = "";
    }
  }

  private _playerName(entityId: string | null): string {
    return this._info?.players.find((p) => p.entity_id === entityId)?.name ?? entityId ?? "";
  }

  private _toggleMenu(): void {
    this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }));
  }

  protected render(): TemplateResult {
    return html`
      <div class="toolbar">
        ${this.narrow
          ? customElements.get("ha-menu-button")
            ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`
            : html`<button class="menu" aria-label="Menu" @click=${this._toggleMenu}>☰</button>`
          : nothing}
        <div class="title">AudioMuse</div>
        ${this._info && this._info.entries.length > 1
          ? html`<select
              class="server"
              aria-label="AudioMuse-AI server"
              .value=${this._entryId}
              @change=${(e: Event) => this._selectEntry((e.target as HTMLSelectElement).value)}
            >
              ${this._info.entries.map((e) => html`<option value=${e.entry_id}>${e.title}</option>`)}
            </select>`
          : nothing}
      </div>
      <div class="content">${this._renderBody()}</div>
    `;
  }

  private _renderBody(): TemplateResult {
    if (this._loadError) {
      return html`<div class="card"><p class="error">Could not load AudioMuse: ${this._loadError}</p>
        <button @click=${() => this._load()}>Try again</button></div>`;
    }
    if (!this._info) return html`<div class="card"><p class="muted">Loading…</p></div>`;
    if (!this._info.entries.length) {
      return html`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;
    }
    const entry = this._entry!;
    return html`
      ${this._renderStatus(entry)}
      <div class="grid">
        <section class="card make">${this._renderMake(entry)}</section>
        <section class="card ideas">${this._renderIdeas()}</section>
      </div>
    `;
  }

  private _renderStatus(entry: Entry): TemplateResult {
    const parts = [
      entry.songs_analysed != null ? `${entry.songs_analysed.toLocaleString(this.hass?.language)} songs analysed` : null,
      entry.music_server ? `${entry.music_server}` : null,
      entry.version ? `AudioMuse-AI ${entry.version}` : null,
      entry.busy_workers ? "analysis running" : null,
    ].filter(Boolean);
    return html`<div class="status">${parts.join(" · ")}</div>`;
  }

  private _renderMake(entry: Entry): TemplateResult {
    const busy = this._busy !== "";
    return html`
      <h2>Make a playlist</h2>
      <textarea
        rows="3"
        aria-label="What do you want to hear?"
        placeholder="Describe what you want to hear, e.g. relaxed acoustic songs for a rainy afternoon"
        .value=${this._prompt}
        @input=${(e: Event) => (this._prompt = (e.target as HTMLTextAreaElement).value)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) void this._make();
        }}
      ></textarea>
      <div class="row">
        <label class="count"
          >Songs
          <input
            type="number"
            min=${this._info!.min_count}
            max=${this._info!.max_count}
            .value=${String(this._count)}
            @change=${(e: Event) => {
              const n = parseInt((e.target as HTMLInputElement).value, 10);
              if (!Number.isNaN(n)) this._count = Math.min(Math.max(n, this._info!.min_count), this._info!.max_count);
            }}
        /></label>
        <button class="primary" ?disabled=${busy || !this._prompt.trim()} @click=${() => this._make()}>
          Make playlist
        </button>
      </div>
      ${this._busy === "make"
        ? html`<div class="working"><span class="spinner"></span>Asking the AI to pick songs… this usually takes
            10–30 seconds.</div>`
        : nothing}
      ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
      ${this._tracks ? this._renderResult(entry) : nothing}
    `;
  }

  private _renderResult(entry: Entry): TemplateResult {
    const tracks = this._tracks!;
    const busy = this._busy !== "";
    const serverType = entry.music_server_type ?? "this";
    let playHint: TemplateResult | typeof nothing = nothing;
    if (!entry.playback) {
      playHint = html`<p class="hint">Playing on speakers isn't available for ${serverType} servers. Save the
        playlist and play it from your music app.</p>`;
    } else if (!this._info!.music_assistant) {
      playHint = html`<p class="hint">Add the Music Assistant integration to play playlists on your speakers.</p>`;
    } else if (!this._info!.players.length) {
      playHint = html`<p class="hint">No Music Assistant speakers found.</p>`;
    } else if (!entry.playback_verified) {
      playHint = html`<p class="hint">Playback on ${serverType} servers hasn't been tested yet. If it doesn't
        work, please report it.</p>`;
    }
    return html`
      <div class="result">
        <div class="result-head">
          <strong>${tracks.length} songs</strong>${this._model ? html`<span class="muted"> · picked by ${this._model}</span>` : nothing}
        </div>
        <ol class="tracks">
          ${tracks.map(
            (t) => html`<li>
              <span class="track-title">${t.title}</span>
              <span class="track-meta">${t.artist}${t.album ? html` · ${t.album}` : nothing}</span>
            </li>`
          )}
        </ol>
        <label class="name"
          >Playlist name
          <input
            .value=${this._name}
            @input=${(e: Event) => {
              this._name = (e.target as HTMLInputElement).value;
              this._nameTouched = true;
            }}
        /></label>
        <div class="actions">
          ${this._canPlay
            ? html`<select
                  aria-label="Speaker"
                  .value=${this._player}
                  @change=${(e: Event) => {
                    this._player = (e.target as HTMLSelectElement).value;
                    localStorage.setItem(LS_PLAYER, this._player);
                  }}
                >
                  ${this._info!.players.map(
                    (p) => html`<option value=${p.entity_id} ?selected=${p.entity_id === this._player}>${p.name}</option>`
                  )}
                </select>
                <button class="primary" ?disabled=${busy} @click=${() => this._save(true)}>
                  ${this._busy === "play" ? "Starting…" : "Save & play"}
                </button>`
            : nothing}
          <button ?disabled=${busy} @click=${() => this._save(false)}>
            ${this._busy === "save" ? "Saving…" : "Save to library"}
          </button>
        </div>
        ${playHint}
        ${this._saved
          ? html`<div class="saved" role="status">
              ✓ Saved as <strong>${this._saved.playlist_name}</strong>${this._saved.played_on
                ? html` and playing on <strong>${this._playerName(this._saved.played_on)}</strong>`
                : nothing}. It will show up in your music apps.
              ${this._saved.playlist_id && this._canPlay && this._saved.played_on !== this._player
                ? html`<button class="link" ?disabled=${busy} @click=${() => this._playSaved()}>
                    Play on ${this._playerName(this._player)}
                  </button>`
                : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderIdeas(): TemplateResult {
    return html`
      <h2>Playlist ideas</h2>
      <p class="muted">Suggestions from your library. Tap one to make it.</p>
      ${this._ideasError
        ? html`<p class="error">${this._ideasError}</p>`
        : html`<div class="chips">
            ${this._shownIdeas.map(
              (idea) => html`<button class="chip" ?disabled=${this._busy !== ""} @click=${() => this._make(idea)}>
                ${idea}
              </button>`
            )}
          </div>`}
      ${this._ideas.length > IDEAS_SHOWN
        ? html`<button class="link" @click=${() => this._moreIdeas()}>More ideas</button>`
        : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, inherit));
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--header-height, 56px);
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      border-bottom: var(--app-header-border-bottom, none);
    }
    .title {
      flex: 1;
      font-size: 20px;
      margin-left: 8px;
    }
    .menu {
      background: none;
      border: none;
      color: inherit;
      font-size: 22px;
      cursor: pointer;
    }
    .server {
      max-width: 50%;
    }
    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }
    .status {
      color: var(--secondary-text-color);
      font-size: 14px;
      margin: 0 4px 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      align-items: start;
    }
    @media (min-width: 900px) {
      .grid {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      }
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      box-shadow: var(--ha-card-box-shadow, none);
      padding: 16px;
    }
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 12px;
    }
    textarea,
    input,
    select {
      font: inherit;
      color: var(--primary-text-color);
      background: var(--secondary-background-color, transparent);
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
    }
    textarea {
      width: 100%;
      resize: vertical;
    }
    .row,
    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    }
    .row .primary {
      margin-left: auto;
    }
    .count input {
      width: 5em;
      margin-left: 6px;
    }
    label {
      font-size: 14px;
      color: var(--secondary-text-color);
    }
    .name {
      display: block;
      margin-top: 12px;
    }
    .name input {
      display: block;
      width: 100%;
      margin-top: 4px;
    }
    button {
      font: inherit;
      cursor: pointer;
      border-radius: 18px;
      padding: 8px 16px;
      border: 1px solid var(--primary-color);
      background: transparent;
      color: var(--primary-color);
    }
    button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    button.link {
      border: none;
      padding: 4px 0;
      border-radius: 0;
      text-decoration: underline;
    }
    .working {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      color: var(--secondary-text-color);
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 3px solid var(--divider-color, #ccc);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
      flex: none;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .error {
      color: var(--error-color, #db4437);
      margin-top: 12px;
    }
    .muted {
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      margin: 8px 0 0;
    }
    .result {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #ddd);
      padding-top: 12px;
    }
    .tracks {
      margin: 8px 0 0;
      padding-left: 1.6em;
      max-height: 420px;
      overflow-y: auto;
    }
    .tracks li {
      padding: 4px 0;
    }
    .track-title {
      display: block;
    }
    .track-meta {
      display: block;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .saved {
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0;
    }
    .chip {
      border-color: var(--divider-color, #ccc);
      color: var(--primary-text-color);
      padding: 6px 12px;
      font-size: 14px;
      text-align: left;
    }
  `;
}

if (!customElements.get("audiomuse-panel")) {
  customElements.define("audiomuse-panel", AudioMusePanel);
}
