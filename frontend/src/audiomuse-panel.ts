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
  url: string;
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
  available: boolean;
  ai_configured: boolean;
}

interface Unavailable {
  entry_id: string;
  title: string;
  state: string;
  reason: string | null;
}

interface Player {
  entity_id: string;
  name: string;
  state: string | null;
}

interface Info {
  entries: Entry[];
  unavailable: Unavailable[];
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

interface Artist {
  name: string;
  artist_id: string | null;
  track_count: number | null;
  divergence: number | null;
}

interface Radio {
  id: number;
  name: string;
  songs: number | null;
  enabled: boolean;
}

interface RecentItem {
  id: string;
  entry_id: string;
  playlist_id: string | null;
  playlist_name: string;
  source: "instant" | "search" | "artist" | "page";
  detail: string | null;
  track_count: number;
  created: string;
}

type Mode = "ai" | "search";

interface Result {
  tracks: Track[];
  model: string | null;
  source: "instant" | "search" | "artist";
  detail: string;
  label: string;
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
const SEARCH_DELAY_MS = 300;

const IDEAS_SHOWN = 12;

/**
 * The suggestions from AudioMuse-AI's own Instant Playlist page (3.7.1,
 * templates/chat.html), with the same labels and examples. Tapping one fills the
 * request box for editing; nothing runs until "Make playlist". AudioMuse-AI's
 * "Lyrics Theme" suggestion is left out: it needs lyrics analysis, and the API
 * does not report whether that is enabled.
 */
export const SUGGESTIONS: ReadonlyArray<{ icon: string; label: string; text: string }> = [
  { icon: "🎵", label: "Similar Song", text: "Similar to By The Way by Red Hot Chili Peppers" },
  {
    icon: "🎶",
    label: "Multi-Song Mix",
    text: "Similar to Red Hot Chili Peppers - By The Way and Iron Maiden - Run to the Hills",
  },
  { icon: "👑", label: "From Artist", text: "Songs like Madonna" },
  { icon: "🤘", label: "Artists Blend", text: "Sounds like Iron Maiden and Metallica combined" },
  { icon: "🎹", label: "Sound / Vibe", text: "Calm piano songs" },
  { icon: "🧠", label: "AI Brainstorming", text: "Top pop radio songs of 2025" },
  { icon: "💃", label: "Genre / Mood / Year", text: "Sad jazz from the 90s in minor key" },
  {
    icon: "🧭",
    label: "Song Journey",
    text: "A journey from By The Way by Red Hot Chili Peppers to Run to the Hills by Iron Maiden",
  },
  { icon: "🏃", label: "Tempo + Exclusion", text: "Running playlist around 170 BPM, no rap" },
  { icon: "⏱️", label: "Time Budget", text: "One hour of chill acoustic music, one song per artist" },
  { icon: "🆕", label: "Recently Added", text: "Songs added recently, under 4 minutes, no live versions" },
];
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

/** "1 song", "25 songs", "? songs" when unknown. */
export function songs(n: number | null | undefined): string {
  if (n == null) return "? songs";
  return `${n.toLocaleString()} song${n === 1 ? "" : "s"}`;
}

/** "just now", "5 min ago", "3 h ago", "2 days ago", else DD-MM-YYYY. */
export function whenText(iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const mins = Math.round((now - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days <= 6) return `${days} day${days === 1 ? "" : "s"} ago`;
  const d = new Date(t);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
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
    _result: { state: true },
    _artistQuery: { state: true },
    _artistResults: { state: true },
    _artistSearching: { state: true },
    _selectedArtist: { state: true },
    _similar: { state: true },
    _similarLoading: { state: true },
    _includeSimilar: { state: true },
    _artistError: { state: true },
    _radios: { state: true },
    _radiosBusy: { state: true },
    _radiosMsg: { state: true },
    _radiosError: { state: true },
    _recent: { state: true },
    _toastRecent: { state: true },
    _mode: { state: true },
    _makingMode: { state: true },
    _elapsed: { state: true },
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
  declare _result: Result | null;
  declare _artistQuery: string;
  declare _artistResults: Artist[];
  declare _artistSearching: boolean;
  declare _selectedArtist: string;
  declare _similar: Artist[] | null;
  declare _similarLoading: boolean;
  declare _includeSimilar: number;
  declare _artistError: string;
  declare _radios: Radio[] | null;
  declare _radiosBusy: boolean;
  declare _radiosMsg: string;
  declare _radiosError: string;
  declare _recent: RecentItem[];
  declare _toastRecent: string;
  declare _mode: Mode;
  declare _makingMode: Mode;
  declare _elapsed: number;
  declare _saved: Saved | null;
  declare _player: string;
  declare _ideas: string[];
  declare _shownIdeas: string[];
  declare _ideasError: string;
  declare _loadError: string;

  private _loading = false;
  private _searchTimer?: number;
  private _searchSeq = 0;
  private _ticker?: number;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._ticker);
    window.clearTimeout(this._searchTimer);
  }

  private _startTicker(): void {
    this._elapsed = 0;
    window.clearInterval(this._ticker);
    this._ticker = window.setInterval(() => (this._elapsed += 1), 1000);
  }

  private _stopTicker(): void {
    window.clearInterval(this._ticker);
  }

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
    this._result = null;
    this._saved = null;
    this._player = "";
    this._artistQuery = "";
    this._artistResults = [];
    this._artistSearching = false;
    this._selectedArtist = "";
    this._similar = null;
    this._similarLoading = false;
    this._includeSimilar = 4;
    this._artistError = "";
    this._radios = null;
    this._radiosBusy = false;
    this._radiosMsg = "";
    this._radiosError = "";
    this._recent = [];
    this._toastRecent = "";
    this._mode = "ai";
    this._makingMode = "ai";
    this._elapsed = 0;
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

  private async _reload(): Promise<void> {
    this._info = undefined;
    await this._load();
  }

  private _selectEntry(entryId: string, remember = true): void {
    const entry = this._info?.entries.find((e) => e.entry_id === entryId);
    if (!entry || !this._info) return;
    this._entryId = entryId;
    if (remember) localStorage.setItem(LS_ENTRY, entryId);
    this._count = entry.default_count;
    this._mode = entry.ai_configured ? "ai" : "search";
    const players = this._info.players.map((p) => p.entity_id);
    const remembered = localStorage.getItem(LS_PLAYER);
    this._player =
      (remembered && players.includes(remembered) && remembered) ||
      (entry.default_player && players.includes(entry.default_player) && entry.default_player) ||
      players[0] ||
      "";
    this._result = null;
    this._saved = null;
    this._error = "";
    this._artistQuery = "";
    this._artistResults = [];
    this._selectedArtist = "";
    this._similar = null;
    this._radiosMsg = "";
    void this._loadIdeas();
    void this._loadRadios();
    void this._loadRecent();
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

  private async _make(prompt?: string, mode?: Mode): Promise<void> {
    if (prompt !== undefined) {
      this._prompt = prompt;
      this._nameTouched = false;
    }
    const text = this._prompt.trim();
    if (!text || !this.hass || this._busy) return;
    const useMode: Mode = mode ?? (this._entry?.ai_configured ? this._mode : "search");
    this._busy = "make";
    this._makingMode = useMode;
    this._error = "";
    this._result = null;
    this._saved = null;
    this._startTicker();
    try {
      if (useMode === "ai") {
        const res = await this.hass.callWS<{ tracks: Track[]; ai_model: string | null }>({
          type: "audiomuse/instant",
          entry_id: this._entryId,
          prompt: text,
          count: this._count,
        });
        this._result = { tracks: res.tracks, model: res.ai_model, source: "instant", detail: text, label: "" };
      } else {
        const res = await this.hass.callWS<{ tracks: Track[] }>({
          type: "audiomuse/search",
          entry_id: this._entryId,
          query: text,
          count: this._count,
        });
        this._result = { tracks: res.tracks, model: null, source: "search", detail: text, label: "quick search" };
      }
      if (!this._nameTouched) this._name = nameFromPrompt(text);
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._stopTicker();
      this._busy = "";
    }
  }

  private async _save(play: boolean): Promise<void> {
    if (!this.hass || !this._result?.tracks.length || this._busy) return;
    this._busy = play ? "play" : "save";
    this._error = "";
    try {
      const msg: Record<string, unknown> = {
        type: "audiomuse/save",
        entry_id: this._entryId,
        name: this._name.trim() || nameFromPrompt(this._result.detail),
        item_ids: this._result.tracks.map((t) => t.item_id),
        source: this._result.source,
        detail: this._result.detail,
      };
      if (play && this._player) msg.play_on = this._player;
      this._saved = await this.hass.callWS<Saved>(msg);
      void this._loadRecent();
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

  /** Fill the request box with a suggestion for editing (like AudioMuse-AI's own page). */
  private async _useSuggestion(text: string): Promise<void> {
    this._prompt = text;
    this._mode = "ai";
    this._nameTouched = false;
    this._error = "";
    await this.updateComplete;
    const box = this.shadowRoot?.querySelector("textarea");
    if (box) {
      box.focus();
      box.setSelectionRange(text.length, text.length);
    }
  }

  private _onArtistInput(value: string): void {
    this._artistQuery = value;
    window.clearTimeout(this._searchTimer);
    if (value.trim().length < 2) {
      this._artistResults = [];
      this._artistSearching = false;
      return;
    }
    this._searchTimer = window.setTimeout(() => void this._searchArtists(value.trim()), SEARCH_DELAY_MS);
  }

  private async _searchArtists(query: string): Promise<void> {
    if (!this.hass) return;
    const seq = ++this._searchSeq;
    this._artistSearching = true;
    this._artistError = "";
    try {
      const res = await this.hass.callWS<{ artists: Artist[] }>({
        type: "audiomuse/search_artists",
        entry_id: this._entryId,
        query,
      });
      if (seq === this._searchSeq) this._artistResults = res.artists;
    } catch (err) {
      if (seq === this._searchSeq) this._artistError = errorText(err);
    } finally {
      if (seq === this._searchSeq) this._artistSearching = false;
    }
  }

  private async _pickArtist(name: string): Promise<void> {
    if (!this.hass) return;
    this._selectedArtist = name;
    this._artistQuery = name;
    this._artistResults = [];
    this._similar = null;
    this._similarLoading = true;
    this._artistError = "";
    try {
      const res = await this.hass.callWS<{ artists: Artist[] }>({
        type: "audiomuse/similar_artists",
        entry_id: this._entryId,
        artist: name,
        count: 10,
      });
      this._similar = res.artists;
    } catch (err) {
      this._artistError = errorText(err);
    } finally {
      this._similarLoading = false;
    }
  }

  private async _makeArtistMix(): Promise<void> {
    const artist = this._selectedArtist;
    if (!this.hass || !artist || this._busy) return;
    this._busy = "make";
    this._error = "";
    this._result = null;
    this._saved = null;
    this._makingMode = "search";
    this._startTicker();
    this.shadowRoot?.querySelector(".make")?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const res = await this.hass.callWS<{ artists: string[]; tracks: Track[] }>({
        type: "audiomuse/artist_mix",
        entry_id: this._entryId,
        artist,
        include_similar: this._includeSimilar,
        count: this._count,
      });
      const others = res.artists.length - 1;
      this._result = {
        tracks: res.tracks,
        model: null,
        source: "artist",
        detail: artist,
        label: others > 0 ? `${artist} and ${others} similar artist${others === 1 ? "" : "s"}` : artist,
      };
      this._name = others > 0 ? `${artist} and similar` : artist;
      this._nameTouched = false;
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._stopTicker();
      this._busy = "";
    }
  }

  private async _loadRadios(): Promise<void> {
    if (!this.hass || !this._entryId) return;
    try {
      const res = await this.hass.callWS<{ radios: Radio[] }>({ type: "audiomuse/radios", entry_id: this._entryId });
      this._radios = res.radios;
      this._radiosError = "";
    } catch (err) {
      this._radiosError = errorText(err);
    }
  }

  private async _runRadios(): Promise<void> {
    if (!this.hass || this._radiosBusy) return;
    this._radiosBusy = true;
    this._radiosMsg = "";
    this._radiosError = "";
    try {
      const res = await this.hass.callWS<{ playlists_created: number | null; failed: string[] }>({
        type: "audiomuse/run_radios",
        entry_id: this._entryId,
      });
      const made = res.playlists_created ?? 0;
      this._radiosMsg =
        `Refreshed ${made} Radio playlist${made === 1 ? "" : "s"}.` +
        (res.failed.length ? ` Failed: ${res.failed.join(", ")}.` : " They keep the Radio's name in your music apps.");
    } catch (err) {
      this._radiosError = errorText(err);
    } finally {
      this._radiosBusy = false;
    }
  }

  private async _loadRecent(): Promise<void> {
    if (!this.hass || !this._entryId) return;
    try {
      const res = await this.hass.callWS<{ items: RecentItem[] }>({ type: "audiomuse/recent", entry_id: this._entryId });
      this._recent = res.items;
    } catch {
      this._recent = [];
    }
  }

  private async _playRecent(item: RecentItem): Promise<void> {
    if (!this.hass || !item.playlist_id || !this._player || this._busy) return;
    this._busy = "play";
    this._error = "";
    try {
      await this.hass.callWS({
        type: "audiomuse/play",
        entry_id: this._entryId,
        playlist_id: item.playlist_id,
        entity_id: this._player,
      });
      this._toastRecent = `Playing ${item.playlist_name} on ${this._playerName(this._player)}`;
    } catch (err) {
      this._toastRecent = errorText(err);
    } finally {
      this._busy = "";
    }
  }

  private async _forgetRecent(item: RecentItem): Promise<void> {
    if (!this.hass) return;
    await this.hass.callWS({ type: "audiomuse/recent_remove", item_id: item.id });
    this._recent = this._recent.filter((i) => i.id !== item.id);
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
    if (!this._info.entries.length && this._info.unavailable.length) {
      return html`<div class="card banner">
        <p><strong>${this._info.unavailable.map((u) => u.title).join(", ")}</strong> can't be reached right now.
          Home Assistant keeps retrying in the background.</p>
        ${this._info.unavailable[0].reason ? html`<p class="muted">${this._info.unavailable[0].reason}</p>` : nothing}
        <button @click=${() => this._reload()}>Try again</button>
      </div>`;
    }
    if (!this._info.entries.length) {
      return html`<div class="card"><p>No AudioMuse-AI server is set up. Add one under
        <strong>Settings → Devices &amp; services → Add integration → AudioMuse-AI</strong>.</p></div>`;
    }
    const entry = this._entry!;
    return html`
      ${!entry.available
        ? html`<div class="card banner warn" role="alert">AudioMuse-AI isn't answering right now, so actions may
            fail. Home Assistant keeps retrying. <button class="link" @click=${() => this._reload()}>Refresh</button></div>`
        : nothing}
      ${this._renderStatus(entry)}
      <div class="layout">
        <div class="col main">
          <section class="card make">${this._renderMake(entry)}</section>
          <section class="card recent">${this._renderRecent()}</section>
        </div>
        <div class="col side">
          <section class="card ideas">${this._renderIdeas()}</section>
          <section class="card artists">${this._renderArtists()}</section>
          <section class="card radios">${this._renderRadios(entry)}</section>
        </div>
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
      ${entry.ai_configured
        ? html`<div class="suggestions" role="group" aria-label="Suggestions: tap to fill the box, then edit">
            ${SUGGESTIONS.map(
              (sg) => html`<button
                class="suggestion"
                title=${sg.text}
                ?disabled=${busy}
                @click=${() => this._useSuggestion(sg.text)}
              ><span aria-hidden="true">${sg.icon}</span> ${sg.label}</button>`
            )}
          </div>`
        : nothing}
      <div class="row">
        <div class="mode" role="radiogroup" aria-label="How to pick songs">
          <button
            role="radio"
            aria-checked=${this._mode === "ai"}
            class=${this._mode === "ai" && entry.ai_configured ? "on" : ""}
            ?disabled=${!entry.ai_configured || busy}
            title=${entry.ai_configured ? "AudioMuse-AI's AI picks the songs" : "Needs an AI provider"}
            @click=${() => (this._mode = "ai")}
          >AI pick</button>
          <button
            role="radio"
            aria-checked=${this._mode === "search" || !entry.ai_configured}
            class=${this._mode === "search" || !entry.ai_configured ? "on" : ""}
            ?disabled=${busy}
            title="AudioMuse-AI's text search: faster, no AI needed"
            @click=${() => (this._mode = "search")}
          >Quick search</button>
        </div>
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
      ${!entry.ai_configured
        ? html`<p class="hint">AI pick needs an AI provider. Set one in AudioMuse-AI's
            <a href=${`${entry.url}/setup`} target="_blank" rel="noreferrer">Setup Wizard</a> or in this integration's
            options. Quick search works without it.</p>`
        : nothing}
      ${this._busy === "make"
        ? html`<div class="working" role="status"><span class="spinner"></span>${this._makingMode === "ai"
            ? `Asking the AI to pick songs… ${this._elapsed} s (usually 10–30 s)`
            : `Finding songs… ${this._elapsed} s`}</div>`
        : nothing}
      ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
      ${this._result ? this._renderResult(entry) : nothing}
    `;
  }

  private _renderResult(entry: Entry): TemplateResult {
    const result = this._result!;
    const tracks = result.tracks;
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
          <strong>${songs(tracks.length)}</strong>${result.label
            ? html`<span class="muted"> · ${result.label}</span>`
            : result.model
              ? html`<span class="muted"> · picked by ${result.model}</span>`
              : nothing}
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
      <p class="muted">Suggestions from your library. Tap one for a quick playlist (no AI needed).</p>
      ${!this._ideas.length && !this._ideasError ? html`<p class="muted">Loading ideas…</p>` : nothing}
      ${this._ideasError
        ? html`<p class="error">${this._ideasError}</p>`
        : html`<div class="chips">
            ${this._shownIdeas.map(
              (idea) => html`<button class="chip" ?disabled=${this._busy !== ""} @click=${() => {
                  this._mode = "search";
                  void this._make(idea, "search");
                }}>
                ${idea}
              </button>`
            )}
          </div>`}
      ${this._ideas.length > IDEAS_SHOWN
        ? html`<button class="link" @click=${() => this._moreIdeas()}>More ideas</button>`
        : nothing}
    `;
  }

  private _renderArtists(): TemplateResult {
    const busy = this._busy !== "";
    return html`
      <h2>Similar artists</h2>
      <input
        class="search"
        type="search"
        aria-label="Search artists"
        placeholder="Search your artists"
        .value=${this._artistQuery}
        @input=${(e: Event) => this._onArtistInput((e.target as HTMLInputElement).value)}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Enter" && this._artistResults.length) void this._pickArtist(this._artistResults[0].name);
        }}
      />
      ${this._artistSearching ? html`<p class="muted">Searching…</p>` : nothing}
      ${this._artistResults.length
        ? html`<ul class="list">
            ${this._artistResults.map(
              (a) => html`<li>
                <button class="row-button" @click=${() => this._pickArtist(a.name)}>
                  <span>${a.name}</span><span class="muted">${songs(a.track_count)}</span>
                </button>
              </li>`
            )}
          </ul>`
        : this._artistQuery.trim().length >= 2 && !this._artistSearching && !this._selectedArtist
          ? html`<p class="muted">No analysed artist matches that.</p>`
          : nothing}
      ${this._artistError ? html`<p class="error">${this._artistError}</p>` : nothing}
      ${this._selectedArtist && !this._artistResults.length
        ? html`
            ${this._similarLoading ? html`<p class="muted">Finding similar artists…</p>` : nothing}
            ${this._similar
              ? html`<p class="muted">Sounds like <strong>${this._selectedArtist}</strong>:</p>
                  ${this._similar.length
                    ? html`<ul class="list similar">
                        ${this._similar.map(
                          (a, i) => html`<li class=${i < this._includeSimilar ? "included" : ""}>
                            <button class="row-button" @click=${() => this._pickArtist(a.name)}>
                              <span>${a.name}</span><span class="muted">${songs(a.track_count)}</span>
                            </button>
                          </li>`
                        )}
                      </ul>`
                    : html`<p class="muted">No similar artists found yet.</p>`}
                  <div class="row">
                    <label class="count"
                      >Include
                      <input
                        type="number"
                        min="0"
                        max=${Math.min(20, this._similar.length)}
                        .value=${String(this._includeSimilar)}
                        @change=${(e: Event) => {
                          const n = parseInt((e.target as HTMLInputElement).value, 10);
                          if (!Number.isNaN(n)) this._includeSimilar = Math.min(Math.max(n, 0), 20);
                        }}
                      />
                      similar</label
                    >
                    <button class="primary" ?disabled=${busy} @click=${() => this._makeArtistMix()}>Make a mix</button>
                  </div>`
              : nothing}
          `
        : nothing}
    `;
  }

  private _renderRadios(entry: Entry): TemplateResult {
    const enabled = (this._radios ?? []).filter((r) => r.enabled).length;
    return html`
      <h2>Radios</h2>
      ${this._radiosError ? html`<p class="error">${this._radiosError}</p>` : nothing}
      ${this._radios === null && !this._radiosError ? html`<p class="muted">Loading…</p>` : nothing}
      ${this._radios && !this._radios.length
        ? html`<p class="muted">No Radios yet. Create them on AudioMuse-AI's
            <a href=${`${entry.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page, then refresh them
            into your library from here.</p>`
        : nothing}
      ${this._radios?.length
        ? html`<ul class="list">
              ${this._radios.map(
                (r) => html`<li class="radio ${r.enabled ? "" : "off"}">
                  <span>${r.name}</span><span class="muted">${songs(r.songs)}${r.enabled ? "" : " · off"}</span>
                </li>`
              )}
            </ul>
            <div class="row">
              <button ?disabled=${this._radiosBusy || !enabled} @click=${() => this._runRadios()}>
                ${this._radiosBusy ? "Refreshing…" : "Refresh into library"}
              </button>
            </div>`
        : nothing}
      ${this._radiosMsg ? html`<p class="hint">${this._radiosMsg}</p>` : nothing}
    `;
  }

  private _renderRecent(): TemplateResult {
    return html`
      <h2>Recent</h2>
      ${!this._recent.length
        ? html`<p class="muted">Playlists you save from Home Assistant appear here.</p>`
        : html`<ul class="list recent-list">
            ${this._recent.map(
              (item) => html`<li>
                <div class="recent-text">
                  <span>${item.playlist_name}</span>
                  <span class="muted"
                    >${whenText(item.created)} · ${songs(item.track_count)}${item.detail
                      ? html` · ${item.source === "artist" ? "artist" : item.source === "search" ? "search" : "request"}: ${item.detail}`
                      : nothing}</span
                  >
                </div>
                ${this._canPlay && item.playlist_id
                  ? html`<button ?disabled=${this._busy !== ""} @click=${() => this._playRecent(item)}>Play</button>`
                  : nothing}
                <button class="icon" aria-label="Forget" title="Forget (the playlist stays in your library)"
                  @click=${() => this._forgetRecent(item)}>×</button>
              </li>`
            )}
          </ul>`}
      ${this._toastRecent ? html`<p class="hint" role="status">${this._toastRecent}</p>` : nothing}
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
    .layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .col {
      display: contents;
    }
    /* phone order: make, ideas, artists, recent, radios */
    .make { order: 1; }
    .ideas { order: 2; }
    .artists { order: 3; }
    .recent { order: 4; }
    .radios { order: 5; }
    @media (min-width: 900px) {
      .layout {
        flex-direction: row;
        align-items: flex-start;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
      }
      .col.main { flex: 2; }
      .col.side { flex: 1; }
    }
    .search {
      width: 100%;
    }
    .list {
      list-style: none;
      margin: 8px 0 0;
      padding: 0;
    }
    .list li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color, #eee);
    }
    .list li:last-child {
      border-bottom: none;
    }
    .row-button {
      flex: 1;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      border: none;
      border-radius: 6px;
      padding: 4px 6px;
      color: var(--primary-text-color);
      text-align: left;
    }
    .row-button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .similar li.included .row-button span:first-child {
      font-weight: 500;
    }
    .similar li.included::before {
      content: "✓";
      color: var(--primary-color);
      width: 1em;
    }
    .similar li:not(.included)::before {
      content: "";
      width: 1em;
    }
    .radio {
      justify-content: space-between;
    }
    .radio.off {
      opacity: 0.6;
    }
    .recent-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .recent-text span:first-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    button.icon {
      border: none;
      padding: 4px 8px;
      font-size: 18px;
      color: var(--secondary-text-color);
    }
    a {
      color: var(--primary-color);
    }
    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .suggestion {
      padding: 3px 10px;
      font-size: 13px;
      border-color: var(--divider-color, #ccc);
      color: var(--primary-text-color);
      border-radius: 14px;
    }
    .mode {
      display: inline-flex;
      border: 1px solid var(--primary-color);
      border-radius: 18px;
      overflow: hidden;
    }
    .mode button {
      border: none;
      border-radius: 0;
      padding: 6px 14px;
    }
    .mode button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .banner {
      margin-bottom: 12px;
    }
    .banner.warn {
      border-color: var(--warning-color, #ffa600);
    }
    @media (pointer: coarse) {
      button,
      .chip,
      input,
      select {
        min-height: 40px;
      }
      .mode button {
        min-height: 38px;
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
