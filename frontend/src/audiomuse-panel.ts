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
  lyrics_available?: boolean;
  lyrics_songs?: number | null;
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
  /** Example pair of songs that sound alike (only when "why similar" is asked for). */
  sounds_alike?: { artist_song: string; similar_song: string } | null;
}

interface Radio {
  id: number;
  name: string;
  songs: number | null;
  enabled: boolean;
  anchor_id?: number | null;
  temperature?: number | null;
}

/** One Song Alchemy ingredient. */
interface AlchemyItem {
  type: "song" | "artist";
  id: string;
  label: string;
  sub: string;
  op: "include" | "exclude";
}
type AlchemyPart = "mix" | "anchors" | "radios";

interface RecentItem {
  id: string;
  entry_id: string;
  playlist_id: string | null;
  playlist_name: string;
  /** playlist_name without AudioMuse-AI's "_instant" suffix (older integrations don't send it). */
  display_name?: string;
  source: "instant" | "search" | "artist" | "song" | "path" | "alchemy" | "page";
  detail: string | null;
  track_count: number;
  created: string;
}

type Mode = "ai" | "search";

/** The page's tabs. More arrive in later steps (issue #15). */
interface Anchor {
  id: number;
  name: string;
}

/** One end of a Song Path, with AudioMuse-AI's four kinds of end. */
type PathMode = "song" | "lyrics" | "mood" | "anchor";
interface PathEnd {
  mode: PathMode;
  query: string;
  results: Track[];
  searching: boolean;
  song: Track | null;
  mood: string;
  anchorId: number | null;
}
type Side = "start" | "end";
/** The moods AudioMuse-AI's Song Path accepts (same order and names as its page). */
const PATH_MOODS: ReadonlyArray<[string, string]> = [
  ["happy", "Happy"],
  ["sad", "Sad"],
  ["aggressive", "Aggressive"],
  ["relaxed", "Relaxed"],
  ["danceable", "Danceable"],
];

function newPathEnd(): PathEnd {
  return { mode: "song", query: "", results: [], searching: false, song: null, mood: "happy", anchorId: null };
}

type Tab = "make" | "song" | "artists" | "path" | "alchemy";
const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: "make", label: "Make a playlist" },
  { id: "song", label: "Playlist from Similar Song" },
  { id: "artists", label: "Similar artists" },
  { id: "path", label: "Song Path" },
  { id: "alchemy", label: "Song Alchemy" },
];

interface Result {
  tracks: Track[];
  model: string | null;
  source: "instant" | "search" | "artist" | "song" | "path" | "alchemy";
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
 * request box for editing; nothing runs until "Make playlist". "Lyrics Theme"
 * only shows once lyrics analysis is enabled and has analysed some songs
 * (AudioMuse-AI's own page shows it as soon as the setting is on).
 */
export const SUGGESTIONS: ReadonlyArray<{ icon: string; label: string; text: string; lyrics?: boolean }> = [
  { icon: "🎵", label: "Similar Song", text: "Similar to By The Way by Red Hot Chili Peppers" },
  {
    icon: "🎶",
    label: "Multi-Song Mix",
    text: "Similar to Red Hot Chili Peppers - By The Way and Iron Maiden - Run to the Hills",
  },
  { icon: "👑", label: "From Artist", text: "Songs like Madonna" },
  { icon: "🤘", label: "Artists Blend", text: "Sounds like Iron Maiden and Metallica combined" },
  { icon: "🎹", label: "Sound / Vibe", text: "Calm piano songs" },
  { icon: "📝", label: "Lyrics Theme", text: "Songs about heartbreak in the rain", lyrics: true },
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
const LS_TAB = "audiomuse.tab";

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
    _tab: { state: true },
    _resultTab: { state: true },
    _similarCount: { state: true },
    _why: { state: true },
    _songQuery: { state: true },
    _songResults: { state: true },
    _songSearching: { state: true },
    _songError: { state: true },
    _seedSong: { state: true },
    _seedMode: { state: true },
    _anchors: { state: true },
    _anchorId: { state: true },
    _songCount: { state: true },
    _limitPerArtist: { state: true },
    _radius: { state: true },
    _pathStart: { state: true },
    _pathEnd: { state: true },
    _pathCount: { state: true },
    _pathExact: { state: true },
    _alcPart: { state: true },
    _alcItems: { state: true },
    _alcQuery: { state: true },
    _alcArtists: { state: true },
    _alcSongs: { state: true },
    _alcSearching: { state: true },
    _alcCount: { state: true },
    _alcTemp: { state: true },
    _alcSubtract: { state: true },
    _blendId: { state: true },
    _anchorName: { state: true },
    _alcMsg: { state: true },
    _renaming: { state: true },
    _newRadioAnchor: { state: true },
    _newRadioTemp: { state: true },
    _newRadioSongs: { state: true },
    _alcRemoved: { state: true },
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
  declare _tab: Tab;
  /** The tab whose playlist is showing in _result (and where busy/error show). */
  declare _resultTab: Tab;
  declare _similarCount: number;
  declare _why: boolean;
  declare _songQuery: string;
  declare _songResults: Track[];
  declare _songSearching: boolean;
  declare _songError: string;
  declare _seedSong: Track | null;
  declare _seedMode: "song" | "anchor";
  declare _anchors: Anchor[] | null;
  declare _anchorId: number | null;
  declare _songCount: number;
  declare _limitPerArtist: boolean;
  declare _radius: boolean;
  declare _pathStart: PathEnd;
  declare _pathEnd: PathEnd;
  declare _pathCount: number;
  declare _pathExact: boolean;
  declare _alcPart: AlchemyPart;
  declare _alcItems: AlchemyItem[];
  declare _alcQuery: string;
  declare _alcArtists: Artist[];
  declare _alcSongs: Track[];
  declare _alcSearching: boolean;
  declare _alcCount: number;
  declare _alcTemp: number;
  /** "" = AudioMuse-AI's own default. */
  declare _alcSubtract: string;
  declare _blendId: string | null;
  declare _anchorName: string;
  declare _alcMsg: string;
  declare _renaming: { id: number; name: string } | null;
  declare _newRadioAnchor: number | null;
  declare _newRadioTemp: number;
  declare _newRadioSongs: number;
  /** Songs AudioMuse-AI removed for being near an exclude, on the last run. */
  declare _alcRemoved: number;

  private _loading = false;
  private _searchTimer?: number;
  private _searchSeq = 0;
  private _songTimer?: number;
  private _songSeq = 0;
  private _pathTimers: Partial<Record<Side, number>> = {};
  private _pathSeq: Record<Side, number> = { start: 0, end: 0 };
  private _alcTimer?: number;
  private _alcSeq = 0;
  private _ticker?: number;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._ticker);
    window.clearTimeout(this._searchTimer);
    window.clearTimeout(this._songTimer);
    window.clearTimeout(this._pathTimers.start);
    window.clearTimeout(this._pathTimers.end);
    window.clearTimeout(this._alcTimer);
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
    const tab = localStorage.getItem(LS_TAB);
    this._tab = TABS.some((t) => t.id === tab) ? (tab as Tab) : "make";
    this._resultTab = "make";
    this._similarCount = 10;
    this._why = true;
    this._songQuery = "";
    this._songResults = [];
    this._songSearching = false;
    this._songError = "";
    this._seedSong = null;
    this._seedMode = "song";
    this._anchors = null;
    this._anchorId = null;
    this._songCount = 25;
    this._limitPerArtist = true;
    this._radius = true;
    this._pathStart = newPathEnd();
    this._pathEnd = newPathEnd();
    this._pathCount = 25;
    this._pathExact = true;
    this._alcPart = "mix";
    this._alcItems = [];
    this._alcQuery = "";
    this._alcArtists = [];
    this._alcSongs = [];
    this._alcSearching = false;
    this._alcCount = 25;
    this._alcTemp = 1;
    this._alcSubtract = "";
    this._blendId = null;
    this._anchorName = "";
    this._alcMsg = "";
    this._renaming = null;
    this._newRadioAnchor = null;
    this._newRadioTemp = 1;
    this._newRadioSongs = 50;
    this._alcRemoved = 0;
  }

  private _selectTab(tab: Tab): void {
    this._tab = tab;
    localStorage.setItem(LS_TAB, tab);
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
    this._songCount = entry.default_count;
    this._pathCount = entry.default_count;
    this._alcCount = entry.default_count;
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
    this._songQuery = "";
    this._songResults = [];
    this._seedSong = null;
    this._anchors = null;
    this._anchorId = null;
    this._pathStart = newPathEnd();
    this._pathEnd = newPathEnd();
    this._alcItems = [];
    this._alcQuery = "";
    this._blendId = null;
    this._alcMsg = "";
    void this._loadIdeas();
    void this._loadAnchors();
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
    this._resultTab = "make";
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
        count: this._similarCount,
        why: this._why,
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
    this._resultTab = "artists";
    this._error = "";
    this._result = null;
    this._saved = null;
    this._makingMode = "search";
    this._startTicker();
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

  private async _loadAnchors(): Promise<void> {
    if (!this.hass || !this._entryId) return;
    try {
      const res = await this.hass.callWS<{ anchors: Anchor[] }>({ type: "audiomuse/anchors", entry_id: this._entryId });
      this._anchors = res.anchors;
      if (this._anchorId === null && res.anchors.length) this._anchorId = res.anchors[0].id;
    } catch {
      this._anchors = [];
    }
  }

  private _onSongInput(value: string): void {
    this._songQuery = value;
    this._seedSong = null;
    window.clearTimeout(this._songTimer);
    if (value.trim().length < 2) {
      this._songResults = [];
      this._songSearching = false;
      return;
    }
    this._songTimer = window.setTimeout(() => void this._searchSongs(value.trim()), SEARCH_DELAY_MS);
  }

  private async _searchSongs(query: string): Promise<void> {
    if (!this.hass) return;
    const seq = ++this._songSeq;
    this._songSearching = true;
    this._songError = "";
    try {
      const res = await this.hass.callWS<{ tracks: Track[] }>({
        type: "audiomuse/search_tracks",
        entry_id: this._entryId,
        query,
      });
      if (seq === this._songSeq) this._songResults = res.tracks.slice(0, 10);
    } catch (err) {
      if (seq === this._songSeq) this._songError = errorText(err);
    } finally {
      if (seq === this._songSeq) this._songSearching = false;
    }
  }

  private _pickSong(track: Track): void {
    this._seedSong = track;
    this._songQuery = track.title;
    this._songResults = [];
  }

  private async _findSimilarSongs(): Promise<void> {
    if (!this.hass || this._busy) return;
    const anchor = this._seedMode === "anchor" ? this._anchors?.find((a) => a.id === this._anchorId) : undefined;
    const seed = this._seedMode === "song" ? this._seedSong : null;
    if (!seed && !anchor) return;
    const what = seed ? seed.title : anchor!.name;
    this._busy = "make";
    this._resultTab = "song";
    this._makingMode = "search";
    this._error = "";
    this._result = null;
    this._saved = null;
    this._startTicker();
    try {
      const res = await this.hass.callWS<{ tracks: Track[] }>({
        type: "audiomuse/similar_tracks",
        entry_id: this._entryId,
        ...(seed ? { item_id: seed.item_id } : { anchor_id: anchor!.id }),
        count: this._songCount,
        limit_per_artist: this._limitPerArtist,
        radius_similarity: this._radius,
      });
      this._result = {
        tracks: res.tracks,
        model: null,
        source: "song",
        detail: seed ? `${seed.title} (${seed.artist})` : `anchor: ${anchor!.name}`,
        label: `like ${what}`,
      };
      this._name = `Like ${what}`;
      this._nameTouched = false;
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._stopTicker();
      this._busy = "";
    }
  }

  private _getEnd(side: Side): PathEnd {
    return side === "start" ? this._pathStart : this._pathEnd;
  }

  private _setEnd(side: Side, changes: Partial<PathEnd>): void {
    if (side === "start") this._pathStart = { ...this._pathStart, ...changes };
    else this._pathEnd = { ...this._pathEnd, ...changes };
  }

  /**
   * AudioMuse-AI's own rules: Lyrics on one end puts both ends on Lyrics (a
   * lyrics path needs two songs); Mood or Anchor on one end puts the other
   * end back to Song (only one end can be a mood or an anchor).
   */
  private _setPathMode(side: Side, mode: PathMode): void {
    const other: Side = side === "start" ? "end" : "start";
    const otherMode = this._getEnd(other).mode;
    this._setEnd(side, { mode });
    if (mode === "lyrics" && otherMode !== "lyrics") this._setEnd(other, { mode: "lyrics" });
    else if (mode === "song" && otherMode === "lyrics") this._setEnd(other, { mode: "song" });
    else if ((mode === "mood" || mode === "anchor") && otherMode !== "song") this._setEnd(other, { mode: "song" });
    if (mode === "anchor" && this._getEnd(side).anchorId === null && this._anchors?.length) {
      this._setEnd(side, { anchorId: this._anchors[0].id });
    }
  }

  private _onPathInput(side: Side, value: string): void {
    this._setEnd(side, { query: value, song: null });
    window.clearTimeout(this._pathTimers[side]);
    if (value.trim().length < 2) {
      this._setEnd(side, { results: [], searching: false });
      return;
    }
    this._pathTimers[side] = window.setTimeout(() => void this._searchPathSongs(side, value.trim()), SEARCH_DELAY_MS);
  }

  private async _searchPathSongs(side: Side, query: string): Promise<void> {
    if (!this.hass) return;
    const seq = ++this._pathSeq[side];
    this._setEnd(side, { searching: true });
    try {
      const res = await this.hass.callWS<{ tracks: Track[] }>({
        type: "audiomuse/search_tracks",
        entry_id: this._entryId,
        query,
      });
      if (seq === this._pathSeq[side]) this._setEnd(side, { results: res.tracks.slice(0, 8) });
    } catch (err) {
      if (seq === this._pathSeq[side]) this._error = errorText(err);
    } finally {
      if (seq === this._pathSeq[side]) this._setEnd(side, { searching: false });
    }
  }

  /** What the page sends for one end, or null when it isn't chosen yet. */
  private _pathEndValue(end: PathEnd): { type: "song" | "mood" | "anchor"; id: string | number } | null {
    if (end.mode === "song" || end.mode === "lyrics") return end.song ? { type: "song", id: end.song.item_id } : null;
    if (end.mode === "mood") return { type: "mood", id: end.mood };
    const anchor = this._anchors?.find((a) => a.id === end.anchorId);
    return anchor ? { type: "anchor", id: anchor.id } : null;
  }

  private _pathEndLabel(end: PathEnd): string {
    if (end.mode === "song" || end.mode === "lyrics") return end.song?.title ?? "";
    if (end.mode === "mood") return PATH_MOODS.find(([id]) => id === end.mood)?.[1] ?? end.mood;
    return this._anchors?.find((a) => a.id === end.anchorId)?.name ?? "";
  }

  private async _findPath(): Promise<void> {
    const start = this._pathEndValue(this._pathStart);
    const end = this._pathEndValue(this._pathEnd);
    if (!this.hass || this._busy || !start || !end) return;
    const from = this._pathEndLabel(this._pathStart);
    const to = this._pathEndLabel(this._pathEnd);
    this._busy = "make";
    this._resultTab = "path";
    this._makingMode = "search";
    this._error = "";
    this._result = null;
    this._saved = null;
    this._startTicker();
    try {
      const res = await this.hass.callWS<{ tracks: Track[] }>({
        type: "audiomuse/find_path",
        entry_id: this._entryId,
        start,
        end,
        count: this._pathCount,
        exact: this._pathExact,
        lyrics: this._pathStart.mode === "lyrics",
      });
      this._result = { tracks: res.tracks, model: null, source: "path", detail: `${from} → ${to}`, label: `${from} → ${to}` };
      this._name = `${from} to ${to}`;
      this._nameTouched = false;
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._stopTicker();
      this._busy = "";
    }
  }

  private _onAlchemyInput(value: string): void {
    this._alcQuery = value;
    window.clearTimeout(this._alcTimer);
    if (value.trim().length < 2) {
      this._alcArtists = [];
      this._alcSongs = [];
      this._alcSearching = false;
      return;
    }
    this._alcTimer = window.setTimeout(() => void this._searchAlchemy(value.trim()), SEARCH_DELAY_MS);
  }

  /** Artists and songs for the Alchemy search box, side by side. */
  private async _searchAlchemy(query: string): Promise<void> {
    if (!this.hass) return;
    const seq = ++this._alcSeq;
    this._alcSearching = true;
    try {
      const [artists, songsRes] = await Promise.all([
        this.hass.callWS<{ artists: Artist[] }>({ type: "audiomuse/search_artists", entry_id: this._entryId, query }),
        this.hass.callWS<{ tracks: Track[] }>({ type: "audiomuse/search_tracks", entry_id: this._entryId, query }),
      ]);
      if (seq !== this._alcSeq) return;
      this._alcArtists = artists.artists.slice(0, 4);
      this._alcSongs = songsRes.tracks.slice(0, 6);
    } catch (err) {
      if (seq === this._alcSeq) this._alcMsg = errorText(err);
    } finally {
      if (seq === this._alcSeq) this._alcSearching = false;
    }
  }

  private _addAlchemyItem(item: AlchemyItem): void {
    if (!this._alcItems.some((i) => i.type === item.type && i.id === item.id)) {
      this._alcItems = [...this._alcItems, item];
    }
    this._alcQuery = "";
    this._alcArtists = [];
    this._alcSongs = [];
  }

  private async _runAlchemy(): Promise<void> {
    const includes = this._alcItems.filter((i) => i.op === "include");
    if (!this.hass || this._busy || !includes.length) return;
    const what = includes.map((i) => i.label).slice(0, 3).join(" + ");
    this._busy = "make";
    this._resultTab = "alchemy";
    this._makingMode = "search";
    this._error = "";
    this._result = null;
    this._saved = null;
    this._blendId = null;
    this._alcMsg = "";
    this._startTicker();
    const subtract = parseFloat(this._alcSubtract);
    try {
      this._alcRemoved = 0;
      const res = await this.hass.callWS<{ tracks: Track[]; blend_id: string | null; removed: number }>({
        type: "audiomuse/alchemy",
        entry_id: this._entryId,
        items: this._alcItems.map(({ type, id, op }) => ({ type, id, op })),
        count: this._alcCount,
        temperature: this._alcTemp,
        ...(Number.isNaN(subtract) ? {} : { subtract_distance: subtract }),
      });
      this._result = { tracks: res.tracks, model: null, source: "alchemy", detail: what, label: `alchemy: ${what}` };
      this._blendId = res.blend_id;
      this._alcRemoved = res.removed ?? 0;
      this._name = `${what} alchemy`;
      this._anchorName = what;
      this._nameTouched = false;
    } catch (err) {
      this._error = errorText(err);
    } finally {
      this._stopTicker();
      this._busy = "";
    }
  }

  private async _saveAnchor(): Promise<void> {
    if (!this.hass || !this._blendId || !this._anchorName.trim()) return;
    try {
      const res = await this.hass.callWS<{ anchor: Anchor }>({
        type: "audiomuse/save_anchor",
        entry_id: this._entryId,
        blend_id: this._blendId,
        name: this._anchorName.trim(),
      });
      this._alcMsg = `✓ Saved anchor "${res.anchor.name}". Use it in Playlist from Similar Song, Song Path and Radios.`;
      void this._loadAnchors();
    } catch (err) {
      this._alcMsg = errorText(err);
    }
  }

  private async _alchemyCall(msg: Record<string, unknown>, done: string): Promise<void> {
    if (!this.hass) return;
    this._radiosMsg = "";
    try {
      await this.hass.callWS({ entry_id: this._entryId, ...msg });
      this._alcMsg = done;
    } catch (err) {
      this._alcMsg = errorText(err);
    }
    await Promise.all([this._loadAnchors(), this._loadRadios()]);
  }

  private async _renameAnchor(): Promise<void> {
    const r = this._renaming;
    if (!r || !r.name.trim()) return;
    this._renaming = null;
    await this._alchemyCall({ type: "audiomuse/rename_anchor", anchor_id: r.id, name: r.name.trim() }, `✓ Renamed to "${r.name.trim()}".`);
  }

  private async _deleteAnchor(anchor: Anchor): Promise<void> {
    const radio = this._radios?.find((r) => r.anchor_id === anchor.id);
    const ask = radio
      ? `Delete the anchor "${anchor.name}"? Its Radio is deleted too. Playlists already made stay in your library.`
      : `Delete the anchor "${anchor.name}"?`;
    if (!window.confirm(ask)) return;
    if (this._anchorId === anchor.id) this._anchorId = null;
    await this._alchemyCall({ type: "audiomuse/delete_anchor", anchor_id: anchor.id }, `✓ Deleted "${anchor.name}".`);
  }

  private async _addRadio(): Promise<void> {
    if (this._newRadioAnchor === null) return;
    const anchor = this._anchors?.find((a) => a.id === this._newRadioAnchor);
    await this._alchemyCall(
      { type: "audiomuse/add_radio", anchor_id: this._newRadioAnchor, temperature: this._newRadioTemp, songs: this._newRadioSongs },
      `✓ Added the Radio "${anchor?.name ?? ""}".`
    );
    this._newRadioAnchor = null;
  }

  private async _updateRadio(radio: Radio, changes: { temperature?: number; songs?: number; enabled?: boolean }): Promise<void> {
    await this._alchemyCall({ type: "audiomuse/update_radio", radio_id: radio.id, ...changes }, `✓ Saved "${radio.name}".`);
  }

  private async _deleteRadio(radio: Radio): Promise<void> {
    if (!window.confirm(`Delete the Radio "${radio.name}"? Its anchor is kept.`)) return;
    await this._alchemyCall({ type: "audiomuse/delete_radio", radio_id: radio.id }, `✓ Deleted the Radio "${radio.name}".`);
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
    this._alcMsg = "";
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
      this._toastRecent = `Playing ${item.display_name ?? item.playlist_name} on ${this._playerName(this._player)}`;
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
      <nav class="tabs" role="tablist" aria-label="AudioMuse">
        ${TABS.map(
          (t) => html`<button
            role="tab"
            id=${`tab-${t.id}`}
            class="tab ${this._tab === t.id ? "on" : ""}"
            aria-selected=${this._tab === t.id}
            aria-controls="tabpanel"
            @click=${(e: Event) => {
              this._selectTab(t.id);
              this._scrollTabIntoView(e.currentTarget as HTMLElement);
            }}
          >${t.label}</button>`
        )}
      </nav>
      <section class="card" id="tabpanel" role="tabpanel" aria-labelledby=${`tab-${this._tab}`}>
        ${this._tab === "make"
          ? html`${this._renderMake(entry)}
              <div class="section">${this._renderIdeas()}</div>
              <div class="section">${this._renderRecent()}</div>`
          : this._tab === "song"
            ? this._renderSong(entry)
            : this._tab === "artists"
            ? this._renderArtists(entry)
            : this._tab === "path"
            ? this._renderPath(entry)
            : this._renderAlchemy(entry)}
      </section>
    `;
  }

  /** Scroll only the tab bar (never the page) so the chosen tab is fully visible. */
  private _scrollTabIntoView(tab: HTMLElement): void {
    const bar = tab.parentElement;
    if (!bar) return;
    const left = tab.offsetLeft - bar.offsetLeft;
    const right = left + tab.offsetWidth;
    if (left < bar.scrollLeft) bar.scrollLeft = left - 8;
    else if (right > bar.scrollLeft + bar.clientWidth) bar.scrollLeft = right - bar.clientWidth + 8;
  }

  /** The working spinner, error and finished playlist for the tab that made it. */
  private _renderOutcome(tab: Tab, entry: Entry): TemplateResult | typeof nothing {
    if (this._resultTab !== tab) return nothing;
    return html`
      ${this._busy === "make"
        ? html`<div class="working" role="status"><span class="spinner"></span>${this._makingMode === "ai"
            ? `Asking the AI to pick songs… ${this._elapsed} s (usually 10–30 s)`
            : `Finding songs… ${this._elapsed} s`}</div>`
        : nothing}
      ${this._error ? html`<div class="error" role="alert">${this._error}</div>` : nothing}
      ${this._result ? this._renderResult(entry) : nothing}
    `;
  }

  private _renderStatus(entry: Entry): TemplateResult {
    const parts = [
      entry.songs_analysed != null ? `${entry.songs_analysed.toLocaleString(this.hass?.language)} songs analysed` : null,
      entry.music_server ? `${entry.music_server}` : null,
      entry.lyrics_available && entry.lyrics_songs
        ? `${entry.lyrics_songs.toLocaleString(this.hass?.language)} with lyrics`
        : null,
      entry.version ? `AudioMuse-AI ${entry.version}` : null,
      entry.busy_workers ? "analysis running" : null,
    ].filter(Boolean);
    // Phones get a shorter line so it fits on one line (issue #15).
    const short = [
      entry.songs_analysed != null ? songs(entry.songs_analysed) : null,
      entry.music_server ? `${entry.music_server}` : null,
      entry.version ? `${entry.version}` : null,
      entry.busy_workers ? "analysing" : null,
    ].filter(Boolean);
    return html`<div class="status">
      <span class="long">${parts.join(" · ")}</span><span class="short">${short.join(" · ")}</span>
    </div>`;
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
            ${SUGGESTIONS.filter((sg) => !sg.lyrics || entry.lyrics_available).map(
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
      ${this._renderOutcome("make", entry)}
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
      <h3>Playlist ideas</h3>
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

  private _renderSong(entry: Entry): TemplateResult {
    const busy = this._busy !== "";
    const anchors = this._anchors ?? [];
    const ready = this._seedMode === "song" ? Boolean(this._seedSong) : this._anchorId !== null && anchors.length > 0;
    return html`
      <h2>Playlist from Similar Song</h2>
      <p class="intro">Pick a song and get a playlist of songs that sound like it.</p>
      <div class="mode seed" role="radiogroup" aria-label="Start from">
        <button
          role="radio"
          aria-checked=${this._seedMode === "song"}
          class=${this._seedMode === "song" ? "on" : ""}
          @click=${() => (this._seedMode = "song")}
        >🎵 Song</button>
        <button
          role="radio"
          aria-checked=${this._seedMode === "anchor"}
          class=${this._seedMode === "anchor" ? "on" : ""}
          @click=${() => (this._seedMode = "anchor")}
        >Anchor</button>
      </div>
      ${this._seedMode === "song"
        ? html`<input
              class="search"
              type="search"
              aria-label="Song, artist or album"
              placeholder="Song, artist or album"
              .value=${this._songQuery}
              @input=${(e: Event) => this._onSongInput((e.target as HTMLInputElement).value)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter" && this._songResults.length) this._pickSong(this._songResults[0]);
              }}
            />
            ${this._songSearching ? html`<p class="muted">Searching…</p>` : nothing}
            ${this._songError ? html`<p class="error">${this._songError}</p>` : nothing}
            ${this._songResults.length
              ? html`<ul class="list">
                  ${this._songResults.map(
                    (t) => html`<li>
                      <button class="row-button" @click=${() => this._pickSong(t)}>
                        <span class="artist-text"
                          ><span>${t.title}</span><small>${t.artist}${t.album ? ` · ${t.album}` : ""}</small></span
                        >
                      </button>
                    </li>`
                  )}
                </ul>`
              : this._songQuery.trim().length >= 2 && !this._songSearching && !this._seedSong
                ? html`<p class="muted">No analysed song matches that.</p>`
                : nothing}
            ${this._seedSong
              ? html`<p class="picked">✓ <strong>${this._seedSong.title}</strong>
                  <span class="muted">${this._seedSong.artist}${this._seedSong.album
                    ? ` · ${this._seedSong.album}`
                    : ""}</span></p>`
              : nothing}`
        : this._anchors === null
          ? html`<p class="muted">Loading anchors…</p>`
          : anchors.length
            ? html`<select
                class="search"
                aria-label="Anchor"
                .value=${String(this._anchorId ?? "")}
                @change=${(e: Event) => (this._anchorId = Number((e.target as HTMLSelectElement).value))}
              >
                ${anchors.map(
                  (a) => html`<option value=${String(a.id)} ?selected=${a.id === this._anchorId}>${a.name}</option>`
                )}
              </select>`
            : html`<p class="muted">No anchors yet. Create them on AudioMuse-AI's
                <a href=${`${entry.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page.</p>`}
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._limitPerArtist}
          @change=${(e: Event) => (this._limitPerArtist = (e.target as HTMLInputElement).checked)}
        />
        <span>Limit songs per artist<small>Stops one artist taking over the playlist.</small></span>
      </label>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._radius}
          @change=${(e: Event) => (this._radius = (e.target as HTMLInputElement).checked)}
        />
        <span>Radius Similarity<small>Orders the songs so they flow into each other.</small></span>
      </label>
      <div class="row">
        <label class="count"
          >Songs
          <input
            type="number"
            min=${this._info!.min_count}
            max=${this._info!.max_count}
            .value=${String(this._songCount)}
            @change=${(e: Event) => {
              const n = parseInt((e.target as HTMLInputElement).value, 10);
              if (!Number.isNaN(n))
                this._songCount = Math.min(Math.max(n, this._info!.min_count), this._info!.max_count);
            }}
        /></label>
        <button class="primary" ?disabled=${busy || !ready} @click=${() => this._findSimilarSongs()}>
          Find Similar Tracks
        </button>
      </div>
      ${this._renderOutcome("song", entry)}
    `;
  }

  private _renderPathEnd(side: Side, entry: Entry): TemplateResult {
    const end = this._getEnd(side);
    const modes: Array<[PathMode, string]> = [
      ["song", "🎵 Song"],
      ...(entry.lyrics_available ? ([["lyrics", "📖 Lyrics"]] as Array<[PathMode, string]>) : []),
      ["mood", "🎭 Mood"],
      ["anchor", "🔖 Anchor"],
    ];
    const anchors = this._anchors ?? [];
    return html`<div class="path-end">
      <label class="end-label">${side === "start" ? "Start" : "End"}</label>
      <div class="mode small" role="radiogroup" aria-label=${side === "start" ? "Start type" : "End type"}>
        ${modes.map(
          ([mode, label]) => html`<button
            role="radio"
            aria-checked=${end.mode === mode}
            class=${end.mode === mode ? "on" : ""}
            @click=${() => this._setPathMode(side, mode)}
          >${label}</button>`
        )}
      </div>
      ${end.mode === "song" || end.mode === "lyrics"
        ? html`<input
              class="search"
              type="search"
              aria-label=${side === "start" ? "Start song" : "End song"}
              placeholder="Song, artist or album"
              .value=${end.query}
              @input=${(e: Event) => this._onPathInput(side, (e.target as HTMLInputElement).value)}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter" && end.results.length) {
                  this._setEnd(side, { song: end.results[0], query: end.results[0].title, results: [] });
                }
              }}
            />
            ${end.searching ? html`<p class="muted">Searching…</p>` : nothing}
            ${end.results.length
              ? html`<ul class="list">
                  ${end.results.map(
                    (t) => html`<li>
                      <button
                        class="row-button"
                        @click=${() => this._setEnd(side, { song: t, query: t.title, results: [] })}
                      >
                        <span class="artist-text"
                          ><span>${t.title}</span><small>${t.artist}${t.album ? ` · ${t.album}` : ""}</small></span
                        >
                      </button>
                    </li>`
                  )}
                </ul>`
              : end.query.trim().length >= 2 && !end.searching && !end.song
                ? html`<p class="muted">No analysed song matches that.</p>`
                : nothing}
            ${end.song
              ? html`<p class="picked">✓ <strong>${end.song.title}</strong>
                  <span class="muted">${end.song.artist}${end.song.album ? ` · ${end.song.album}` : ""}</span></p>`
              : nothing}`
        : end.mode === "mood"
          ? html`<select
              class="search"
              aria-label=${side === "start" ? "Start mood" : "End mood"}
              .value=${end.mood}
              @change=${(e: Event) => this._setEnd(side, { mood: (e.target as HTMLSelectElement).value })}
            >
              ${PATH_MOODS.map(([id, label]) => html`<option value=${id} ?selected=${id === end.mood}>${label}</option>`)}
            </select>`
          : anchors.length
            ? html`<select
                class="search"
                aria-label=${side === "start" ? "Start anchor" : "End anchor"}
                @change=${(e: Event) => this._setEnd(side, { anchorId: Number((e.target as HTMLSelectElement).value) })}
              >
                ${anchors.map(
                  (a) => html`<option value=${String(a.id)} ?selected=${a.id === end.anchorId}>${a.name}</option>`
                )}
              </select>`
            : html`<p class="muted">No anchors yet. Create them on AudioMuse-AI's
                <a href=${`${entry.url}/alchemy`} target="_blank" rel="noreferrer">Song Alchemy</a> page.</p>`}
    </div>`;
  }

  private _renderPath(entry: Entry): TemplateResult {
    const busy = this._busy !== "";
    const ready = Boolean(this._pathEndValue(this._pathStart) && this._pathEndValue(this._pathEnd));
    return html`
      <h2>Song Path</h2>
      <p class="intro">Pick a start and an end, and get a playlist that moves gradually from one to the other.</p>
      ${this._renderPathEnd("start", entry)} ${this._renderPathEnd("end", entry)}
      ${this._pathStart.mode === "lyrics"
        ? html`<p class="hint">Lyrics: the path follows what the songs are about as well as how they sound.</p>`
        : nothing}
      <div class="row">
        <label class="count"
          >Songs in path
          <input
            type="number"
            min=${this._info!.min_count}
            max=${this._info!.max_count}
            .value=${String(this._pathCount)}
            @change=${(e: Event) => {
              const n = parseInt((e.target as HTMLInputElement).value, 10);
              if (!Number.isNaN(n))
                this._pathCount = Math.min(Math.max(n, this._info!.min_count), this._info!.max_count);
            }}
        /></label>
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._pathExact}
          @change=${(e: Event) => (this._pathExact = (e.target as HTMLInputElement).checked)}
        />
        <span>Keep path size exact<small>On: exactly that many songs. Off: the path may be shorter if there's no good
            link.</small></span>
      </label>
      <div class="row">
        <button class="primary" ?disabled=${busy || !ready} @click=${() => this._findPath()}>Find Path</button>
      </div>
      ${this._renderOutcome("path", entry)}
    `;
  }

  private _renderArtists(entry: Entry): TemplateResult {
    const busy = this._busy !== "";
    return html`
      <h2>Similar artists</h2>
      <p class="intro">Find artists with a similar sound, then make a mix from them.</p>
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
      <div class="row">
        <label class="count"
          >Number of similar artists
          <input
            type="number"
            min="1"
            max="50"
            .value=${String(this._similarCount)}
            @change=${(e: Event) => {
              const n = parseInt((e.target as HTMLInputElement).value, 10);
              if (Number.isNaN(n)) return;
              this._similarCount = Math.min(Math.max(n, 1), 50);
              if (this._selectedArtist) void this._pickArtist(this._selectedArtist);
            }}
        /></label>
      </div>
      <label class="check">
        <input
          type="checkbox"
          .checked=${this._why}
          @change=${(e: Event) => {
            this._why = (e.target as HTMLInputElement).checked;
            if (this._why && this._selectedArtist && this._similar?.some((a) => !a.sounds_alike)) {
              void this._pickArtist(this._selectedArtist);
            }
          }}
        />
        <span>Show component matches (why artists are similar)
          <small>Shows a pair of songs that sound alike for each artist.</small></span>
      </label>
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
              ? html`<p class="muted">Sounds like <strong>${this._selectedArtist}</strong>. Tap an artist to see who
                    sounds like them.</p>
                  ${this._similar.length
                    ? html`<ul class="list similar">
                        ${this._similar.map(
                          (a, i) => html`<li class=${i < this._includeSimilar ? "included" : ""}>
                            <button class="row-button" @click=${() => this._pickArtist(a.name)}>
                              <span class="artist-text"
                                ><span>${a.name}</span>${this._why && a.sounds_alike
                                  ? html`<small
                                      >"${a.sounds_alike.similar_song}" sounds like ${this._selectedArtist}'s
                                      "${a.sounds_alike.artist_song}"</small
                                    >`
                                  : nothing}</span
                              ><span class="muted">${songs(a.track_count)}</span>
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
      ${this._renderOutcome("artists", entry)}
    `;
  }

  private _renderAlchemy(entry: Entry): TemplateResult {
    const parts: Array<[AlchemyPart, string]> = [
      ["mix", "Alchemy"],
      ["anchors", "Anchors"],
      ["radios", "Radios"],
    ];
    return html`
      <h2>Song Alchemy</h2>
      <div class="mode seed" role="tablist" aria-label="Song Alchemy">
        ${parts.map(
          ([id, label]) => html`<button
            role="tab"
            aria-selected=${this._alcPart === id}
            class=${this._alcPart === id ? "on" : ""}
            @click=${() => {
              this._alcPart = id;
              this._alcMsg = "";
            }}
          >${label}</button>`
        )}
      </div>
      ${this._alcPart === "mix"
        ? this._renderAlchemyMix(entry)
        : this._alcPart === "anchors"
          ? this._renderAnchors()
          : this._renderRadios()}
      ${this._alcMsg ? html`<p class="hint" role="status">${this._alcMsg}</p>` : nothing}
    `;
  }

  private _renderAlchemyMix(entry: Entry): TemplateResult {
    const busy = this._busy !== "";
    const hasInclude = this._alcItems.some((i) => i.op === "include");
    const showResults = this._alcArtists.length || this._alcSongs.length;
    return html`
      <p class="intro">Pick songs or artists to include, and ones to exclude. AudioMuse-AI blends them into a
        playlist. Exclude removes songs that sound like it; it doesn't ban the artist.</p>
      ${this._alcItems.length
        ? html`<ul class="list items">
            ${this._alcItems.map(
              (item) => html`<li>
                <select
                  class="ie"
                  aria-label=${`Include or exclude ${item.label}`}
                  @change=${(e: Event) => {
                    const op = (e.target as HTMLSelectElement).value as AlchemyItem["op"];
                    this._alcItems = this._alcItems.map((i) => (i === item ? { ...i, op } : i));
                  }}
                >
                  <option value="include" ?selected=${item.op === "include"}>Include</option>
                  <option value="exclude" ?selected=${item.op === "exclude"}>Exclude</option>
                </select>
                <span class="artist-text grow"><span>${item.label}</span><small>${item.sub}</small></span>
                <button
                  class="icon"
                  aria-label=${`Remove ${item.label}`}
                  @click=${() => (this._alcItems = this._alcItems.filter((i) => i !== item))}
                >×</button>
              </li>`
            )}
          </ul>`
        : nothing}
      <input
        class="search"
        type="search"
        aria-label="Add a song or artist"
        placeholder=${this._alcItems.length ? "Add another song or artist" : "Add a song or artist"}
        .value=${this._alcQuery}
        @input=${(e: Event) => this._onAlchemyInput((e.target as HTMLInputElement).value)}
      />
      ${this._alcSearching ? html`<p class="muted">Searching…</p>` : nothing}
      ${showResults
        ? html`<ul class="list">
            ${this._alcArtists.map(
              (a) => html`<li>
                <button
                  class="row-button"
                  @click=${() =>
                    this._addAlchemyItem({ type: "artist", id: a.name, label: a.name, sub: "artist", op: "include" })}
                >
                  <span class="artist-text"><span>${a.name}</span><small>artist</small></span
                  ><span class="muted">${songs(a.track_count)}</span>
                </button>
              </li>`
            )}
            ${this._alcSongs.map(
              (t) => html`<li>
                <button
                  class="row-button"
                  @click=${() =>
                    this._addAlchemyItem({
                      type: "song",
                      id: t.item_id,
                      label: t.title,
                      sub: `song · ${t.artist}`,
                      op: "include",
                    })}
                >
                  <span class="artist-text"><span>${t.title}</span><small>song · ${t.artist}${t.album
                    ? ` · ${t.album}`
                    : ""}</small></span>
                </button>
              </li>`
            )}
          </ul>`
        : this._alcQuery.trim().length >= 2 && !this._alcSearching
          ? html`<p class="muted">No analysed song or artist matches that.</p>`
          : nothing}
      <div class="row settings">
        <label class="count"
          >Number of results
          <input
            type="number"
            min=${this._info!.min_count}
            max=${this._info!.max_count}
            .value=${String(this._alcCount)}
            @change=${(e: Event) => {
              const n = parseInt((e.target as HTMLInputElement).value, 10);
              if (!Number.isNaN(n)) this._alcCount = Math.min(Math.max(n, this._info!.min_count), this._info!.max_count);
            }}
        /></label>
        <label class="count"
          >Sampling temperature (τ)
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            .value=${String(this._alcTemp)}
            @change=${(e: Event) => {
              const n = parseFloat((e.target as HTMLInputElement).value);
              if (!Number.isNaN(n)) this._alcTemp = Math.min(Math.max(n, 0), 10);
            }}
        /></label>
        <label class="count"
          >Subtract distance threshold
          <input
            type="number"
            class="wide"
            min="0"
            step="0.05"
            placeholder="default"
            .value=${this._alcSubtract}
            @change=${(e: Event) => (this._alcSubtract = (e.target as HTMLInputElement).value.trim())}
        /></label>
      </div>
      <p class="hint">Temperature: lower sticks closer to your blend, higher explores more. Subtract distance: how
        much near your excludes is removed (empty = AudioMuse-AI's default).</p>
      <div class="row">
        <button class="primary" ?disabled=${busy || !hasInclude} @click=${() => this._runAlchemy()}>Run Alchemy</button>
      </div>
      ${this._resultTab === "alchemy" && this._result && this._alcRemoved && this._result.tracks.length < this._alcCount
        ? html`<p class="hint warn" role="status">
            Your excludes removed ${songs(this._alcRemoved)}, so there are fewer than ${this._alcCount}. To keep more,
            lower the Subtract distance threshold (for example 0.1) and run Alchemy again.
          </p>`
        : nothing}
      ${this._renderOutcome("alchemy", entry)}
      ${this._resultTab === "alchemy" && this._result && this._blendId
        ? html`<div class="section">
            <h3>Save Anchor</h3>
            <p class="muted">Keep this blend to reuse in Playlist from Similar Song, Song Path and Radios.</p>
            <div class="row">
              <input
                class="grow"
                aria-label="Anchor name"
                .value=${this._anchorName}
                @input=${(e: Event) => (this._anchorName = (e.target as HTMLInputElement).value)}
              />
              <button ?disabled=${!this._anchorName.trim()} @click=${() => this._saveAnchor()}>Save Anchor</button>
            </div>
          </div>`
        : nothing}
    `;
  }

  private _renderAnchors(): TemplateResult {
    const anchors = this._anchors ?? [];
    return html`
      <p class="intro">Anchors are saved Alchemy blends. Save one from an Alchemy result.</p>
      ${this._anchors === null
        ? html`<p class="muted">Loading…</p>`
        : !anchors.length
          ? html`<p class="muted">No anchors yet. Run Alchemy, then use Save Anchor under the result.</p>`
          : html`<ul class="list">
              ${anchors.map((a) =>
                this._renaming?.id === a.id
                  ? html`<li>
                      <input
                        class="grow"
                        aria-label="New name"
                        .value=${this._renaming.name}
                        @input=${(e: Event) =>
                          (this._renaming = { id: a.id, name: (e.target as HTMLInputElement).value })}
                        @keydown=${(e: KeyboardEvent) => {
                          if (e.key === "Enter") void this._renameAnchor();
                          if (e.key === "Escape") this._renaming = null;
                        }}
                      />
                      <button class="primary" @click=${() => this._renameAnchor()}>Save</button>
                      <button @click=${() => (this._renaming = null)}>Cancel</button>
                    </li>`
                  : html`<li>
                      <span class="grow">${a.name}${this._radios?.some((r) => r.anchor_id === a.id)
                        ? html` <small class="muted">· has a Radio</small>`
                        : nothing}</span>
                      <button @click=${() => (this._renaming = { id: a.id, name: a.name })}>Rename</button>
                      <button class="icon" aria-label=${`Delete ${a.name}`} @click=${() => this._deleteAnchor(a)}>×</button>
                    </li>`
              )}
            </ul>`}
    `;
  }

  private _renderRadios(): TemplateResult {
    const radios = this._radios ?? [];
    const enabled = radios.filter((r) => r.enabled).length;
    const free = (this._anchors ?? []).filter((a) => !radios.some((r) => r.anchor_id === a.id));
    const num = (e: Event) => parseFloat((e.target as HTMLInputElement).value);
    return html`
      <p class="intro">A radio is a saved anchor plus a temperature and a number of songs. Refreshing builds a fresh
        playlist from each one that's on.</p>
      ${this._radiosError ? html`<p class="error">${this._radiosError}</p>` : nothing}
      ${this._radios === null && !this._radiosError ? html`<p class="muted">Loading…</p>` : nothing}
      ${this._radios && !radios.length ? html`<p class="muted">No Radios yet.</p>` : nothing}
      ${radios.length
        ? html`<ul class="list radios">
            ${radios.map(
              (r) => html`<li class=${r.enabled ? "" : "off"}>
                <input
                  type="checkbox"
                  aria-label=${`${r.name} on`}
                  .checked=${r.enabled}
                  @change=${(e: Event) => this._updateRadio(r, { enabled: (e.target as HTMLInputElement).checked })}
                />
                <span class="grow">${r.name}</span>
                <label class="count small"
                  >τ
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    .value=${String(r.temperature ?? 1)}
                    @change=${(e: Event) => {
                      const n = num(e);
                      if (!Number.isNaN(n)) void this._updateRadio(r, { temperature: Math.min(Math.max(n, 0), 10) });
                    }}
                /></label>
                <label class="count small"
                  >Songs
                  <input
                    type="number"
                    min="1"
                    max=${this._info!.max_count}
                    .value=${String(r.songs ?? "")}
                    @change=${(e: Event) => {
                      const n = Math.round(num(e));
                      if (!Number.isNaN(n)) void this._updateRadio(r, { songs: Math.min(Math.max(n, 1), this._info!.max_count) });
                    }}
                /></label>
                <button class="icon" aria-label=${`Delete ${r.name}`} @click=${() => this._deleteRadio(r)}>×</button>
              </li>`
            )}
          </ul>`
        : nothing}
      <div class="section">
        <h3>Add Radio</h3>
        ${free.length
          ? html`<div class="row">
              <select
                aria-label="Anchor for the new Radio"
                @change=${(e: Event) => (this._newRadioAnchor = Number((e.target as HTMLSelectElement).value))}
              >
                <option value="" ?selected=${this._newRadioAnchor === null}>Pick an anchor…</option>
                ${free.map((a) => html`<option value=${String(a.id)} ?selected=${a.id === this._newRadioAnchor}>${a.name}</option>`)}
              </select>
              <label class="count small"
                >τ
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  .value=${String(this._newRadioTemp)}
                  @change=${(e: Event) => {
                    const n = num(e);
                    if (!Number.isNaN(n)) this._newRadioTemp = Math.min(Math.max(n, 0), 10);
                  }}
              /></label>
              <label class="count small"
                >Songs
                <input
                  type="number"
                  min="1"
                  max=${this._info!.max_count}
                  .value=${String(this._newRadioSongs)}
                  @change=${(e: Event) => {
                    const n = Math.round(num(e));
                    if (!Number.isNaN(n)) this._newRadioSongs = Math.min(Math.max(n, 1), this._info!.max_count);
                  }}
              /></label>
              <button ?disabled=${this._newRadioAnchor === null} @click=${() => this._addRadio()}>Add Radio</button>
            </div>`
          : html`<p class="muted">${(this._anchors ?? []).length
              ? "Every anchor already has a Radio. Save another anchor from Alchemy to add more."
              : "Radios are made from anchors. Run Alchemy and save an anchor first."}</p>`}
      </div>
      ${radios.length
        ? html`<div class="row">
            <button class="primary" ?disabled=${this._radiosBusy || !enabled} @click=${() => this._runRadios()}>
              ${this._radiosBusy ? "Refreshing…" : "Refresh into library"}
            </button>
          </div>`
        : nothing}
      ${this._radiosMsg ? html`<p class="hint">${this._radiosMsg}</p>` : nothing}
    `;
  }

  private _renderRecent(): TemplateResult {
    return html`
      <h3>Recent</h3>
      ${!this._recent.length
        ? html`<p class="muted">Playlists you save from Home Assistant appear here.</p>`
        : html`<ul class="list recent-list">
            ${this._recent.map(
              (item) => html`<li>
                <div class="recent-text">
                  <span>${item.display_name ?? item.playlist_name}</span>
                  <span class="muted"
                    >${whenText(item.created)} · ${songs(item.track_count)}${item.detail
                      ? html` · ${item.source === "artist" ? "artist" : item.source === "song" ? "song" : item.source === "path" ? "path" : item.source === "alchemy" ? "alchemy" : item.source === "search" ? "search" : "request"}: ${item.detail}`
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
    .status .short {
      display: none;
    }
    @media (max-width: 600px) {
      .content {
        padding: 10px;
      }
      .status .long {
        display: none;
      }
      .status .short {
        display: inline;
      }
    }
    .tabs {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      border-bottom: 1px solid var(--divider-color, #ddd);
      margin-bottom: 16px;
    }
    .tabs::-webkit-scrollbar {
      display: none;
    }
    button.tab {
      flex: none;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 0;
      padding: 10px 14px;
      color: var(--secondary-text-color);
      font-size: 15px;
    }
    button.tab.on {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    #tabpanel {
      max-width: 860px;
    }
    .section {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color, #ddd);
      padding-top: 12px;
    }
    .section.first {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }
    h3 {
      font-size: 16px;
      font-weight: 500;
      margin: 0 0 8px;
    }
    .intro {
      color: var(--secondary-text-color);
      font-size: 14px;
      margin: -6px 0 12px;
    }
    .check {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 10px;
      color: var(--primary-text-color);
    }
    .check input[type="checkbox"] {
      min-height: 0;
      margin: 3px 0 0;
      flex: none;
    }
    .check small,
    .artist-text small {
      display: block;
      color: var(--secondary-text-color);
      font-size: 12px;
    }
    .hint.warn {
      color: var(--warning-color, #b26a00);
    }
    .items select.ie {
      padding: 4px 6px;
      font-size: 13px;
      flex: none;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .row input.grow {
      flex: 1;
      min-width: 8em;
    }
    .count input.wide {
      width: 6.5em;
    }
    .count.small input {
      width: 4em;
      margin-left: 4px;
    }
    .list.radios li {
      flex-wrap: wrap;
    }
    .list.radios .grow {
      min-width: 9em;
    }
    @media (max-width: 600px) {
      .list.radios .grow {
        flex-basis: calc(100% - 40px);
      }
      .list.radios .count.small:first-of-type {
        margin-left: 28px;
      }
    }
    .list li.off .grow {
      opacity: 0.6;
    }
    .path-end {
      margin-bottom: 14px;
    }
    .end-label {
      display: block;
      margin-bottom: 6px;
    }
    .mode.small button {
      padding: 4px 12px;
      font-size: 13px;
    }
    .path-end .search {
      margin-top: 8px;
    }
    .mode.seed {
      margin-bottom: 12px;
    }
    .picked {
      margin: 10px 2px 0;
    }
    .artist-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
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
    .similar li.included .artist-text > span:first-child {
      font-weight: 500;
    }
    .row-button > .muted {
      flex: none;
      white-space: nowrap;
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
