/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { CSSProperties } from "react";
import { Addon, MediaItem, LibraryItem, StreamSource, CalendarDay, NotificationItem, Season } from "./types";

export const ADDONS: Addon[] = [
  { id: "cinemeta", name: "Cinemeta", version: "3.0.14", author: "Stremio", official: true, icon: "🎬", description: "Official metadata for movies & series from IMDB", catalogs: ["Movies", "Series"], installed: true },
  { id: "opensubtitles", name: "OpenSubtitles", version: "2.1.0", author: "OpenSubtitles.com", official: true, icon: "💬", description: "Subtitles for movies and series in 75+ languages", catalogs: [], installed: true },
  { id: "torrentio", name: "Torrentio", version: "0.0.14", author: "TheBeastLT", official: false, icon: "⚡", description: "Provides torrent streams from multiple sources. Configure debrid services for 4K.", catalogs: [], installed: true },
  { id: "tmdb", name: "TMDB Addon", version: "1.0.3", author: "Community", official: false, icon: "🌐", description: "The Movie Database metadata, posters and trailers", catalogs: ["Movies", "Series", "Anime"], installed: false },
  { id: "kitsu", name: "Kitsu", version: "1.1.0", author: "Stremio", official: true, icon: "🌸", description: "Anime catalog from Kitsu.io with full metadata", catalogs: ["Anime"], installed: true },
  { id: "rpdb", name: "RPDB Ratings", version: "0.9.8", author: "RPDB", official: false, icon: "⭐", description: "Rating posters overlay from IMDb, RottenTomatoes, TMDB", catalogs: [], installed: false },
  { id: "dlive", name: "DLive", version: "2.0.0", author: "DLive Team", official: false, icon: "📡", description: "Live TV channels from around the world, 3000+ streams", catalogs: ["Live TV"], installed: false },
  { id: "local", name: "Local Files", version: "1.4.2", author: "Stremio", official: true, icon: "💾", description: "Play local video files and folder libraries on this device", catalogs: ["Local"], installed: true },
  { id: "watchhub", name: "WatchHub", version: "1.2.0", author: "WatchHub", official: false, icon: "📺", description: "Availability on Netflix, Prime, Disney+ and 50+ services", catalogs: [], installed: false },
  { id: "imdb-lists", name: "IMDB Lists", version: "0.8.3", author: "Community", official: false, icon: "📋", description: "Import any IMDB watchlist or top chart as a catalog", catalogs: ["Movies", "Series"], installed: true },
];

export const MOVIES: MediaItem[] = [
  { id: "tt0816692", title: "Interstellar", year: 2014, rating: 8.7, genre: ["Sci-Fi", "Drama"], duration: "2h 49m", match: 98, description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", backdrop: "linear-gradient(135deg,#020814 0%,#071a3e 45%,#030d26 100%)", accent: "#60a5fa", tag: "4K HDR", streams: 12, seasons: null },
  { id: "tt1375666", title: "Inception", year: 2010, rating: 8.8, genre: ["Action", "Sci-Fi"], duration: "2h 28m", match: 96, description: "A thief who steals corporate secrets through the use of dream-sharing technology.", backdrop: "linear-gradient(135deg,#0d0d0d 0%,#1a1a2e 45%,#0d0d0d 100%)", accent: "#c084fc", tag: "HD", streams: 18, seasons: null },
  { id: "tt0137523", title: "Fight Club", year: 1999, rating: 8.8, genre: ["Drama", "Thriller"], duration: "2h 19m", match: 94, description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club.", backdrop: "linear-gradient(135deg,#1a0505 0%,#3d0a0a 45%,#1a0505 100%)", accent: "#f87171", tag: "HD", streams: 9, seasons: null },
  { id: "tt0468569", title: "The Dark Knight", year: 2008, rating: 9.0, genre: ["Action", "Crime"], duration: "2h 32m", match: 99, description: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.", backdrop: "linear-gradient(135deg,#050510 0%,#0a0a30 45%,#050510 100%)", accent: "#facc15", tag: "4K", streams: 22, seasons: null },
  { id: "tt0109830", title: "Forrest Gump", year: 1994, rating: 8.8, genre: ["Drama", "Romance"], duration: "2h 22m", match: 91, description: "The presidencies of Kennedy and Johnson, the Vietnam War through the perspective of an Alabama man.", backdrop: "linear-gradient(135deg,#0a1000 0%,#1a2e0a 45%,#0a1000 100%)", accent: "#4ade80", tag: "HD", streams: 7, seasons: null },
  { id: "tt0133093", title: "The Matrix", year: 1999, rating: 8.7, genre: ["Action", "Sci-Fi"], duration: "2h 16m", match: 97, description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.", backdrop: "linear-gradient(135deg,#001a00 0%,#003300 45%,#001a00 100%)", accent: "#22c55e", tag: "4K HDR", streams: 15, seasons: null },
  { id: "tt0110912", title: "Pulp Fiction", year: 1994, rating: 8.9, genre: ["Crime", "Drama"], duration: "2h 34m", match: 95, description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.", backdrop: "linear-gradient(135deg,#1a0f00 0%,#3d1f00 45%,#1a0f00 100%)", accent: "#fb923c", tag: "HD", streams: 11, seasons: null },
  { id: "tt0245429", title: "Spirited Away", year: 2001, rating: 8.6, genre: ["Animation", "Anime"], duration: "2h 05m", match: 88, description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods.", backdrop: "linear-gradient(135deg,#0a001a 0%,#1a0033 45%,#0a001a 100%)", accent: "#e879f9", tag: "HD", streams: 6, seasons: null },
  { id: "tt6751668", title: "Parasite", year: 2019, rating: 8.5, genre: ["Thriller", "Drama"], duration: "2h 12m", match: 93, description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family.", backdrop: "linear-gradient(135deg,#0d0d0d 0%,#1a1200 45%,#0d0d0d 100%)", accent: "#fbbf24", tag: "4K", streams: 10, seasons: null },
  { id: "tt7286456", title: "Joker", year: 2019, rating: 8.4, genre: ["Crime", "Drama"], duration: "2h 02m", match: 90, description: "A mentally troubled standup comedian embarks on a downward spiral of social revolution and crime.", backdrop: "linear-gradient(135deg,#1a0000 0%,#2d0505 45%,#1a0000 100%)", accent: "#ef4444", tag: "4K HDR", streams: 16, seasons: null },
];

export const SERIES: MediaItem[] = [
  { id: "tt5491994", title: "Planet Earth II", year: 2016, rating: 9.5, genre: ["Documentary"], duration: "6 ep", match: 99, description: "David Attenborough presents extraordinary footage of wildlife in stunning locations across the globe.", backdrop: "linear-gradient(135deg,#001a0d 0%,#003319 45%,#001a0d 100%)", accent: "#34d399", tag: "4K HDR", streams: 8, seasons: 1 },
  { id: "tt0903747", title: "Breaking Bad", year: 2008, rating: 9.5, genre: ["Crime", "Drama"], duration: "5 seasons", match: 98, description: "A high school chemistry teacher diagnosed with cancer turns to manufacturing drugs to secure his family's future.", backdrop: "linear-gradient(135deg,#0d1a00 0%,#1f3300 45%,#0d1a00 100%)", accent: "#a3e635", tag: "HD", streams: 14, seasons: 5 },
  { id: "tt0944947", title: "Game of Thrones", year: 2011, rating: 9.2, genre: ["Drama", "Fantasy"], duration: "8 seasons", match: 96, description: "Nine noble families fight for control over the mythical lands of Westeros.", backdrop: "linear-gradient(135deg,#0a0514 0%,#190a2e 45%,#0a0514 100%)", accent: "#c084fc", tag: "4K", streams: 20, seasons: 8 },
  { id: "tt4574334", title: "Stranger Things", year: 2016, rating: 8.7, genre: ["Sci-Fi", "Horror"], duration: "4 seasons", match: 94, description: "When a young boy disappears, his mother and friends must confront terrifying supernatural forces.", backdrop: "linear-gradient(135deg,#050014 0%,#0d0030 45%,#050014 100%)", accent: "#818cf8", tag: "4K HDR", streams: 11, seasons: 4 },
  { id: "tt7366338", title: "Chernobyl", year: 2019, rating: 9.4, genre: ["Drama", "History"], duration: "5 ep", match: 97, description: "In April 1986, an explosion at the Chernobyl nuclear power plant becomes one of history's worst man-made catastrophes.", backdrop: "linear-gradient(135deg,#0a0e0f 0%,#1a2527 45%,#0a0e0f 100%)", accent: "#94a3b8", tag: "HD", streams: 9, seasons: 1 },
];

export const ANIME: MediaItem[] = [
  { id: "tt0245429-anime", title: "Spirited Away", year: 2001, rating: 8.6, genre: ["Animation", "Anime"], duration: "2h 05m", match: 88, description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods.", backdrop: "linear-gradient(135deg,#0a001a 0%,#1a0033 45%,#0a001a 100%)", accent: "#e879f9", tag: "HD", streams: 6, seasons: null },
  { id: "tt9335498", title: "Demon Slayer", year: 2019, rating: 8.6, genre: ["Anime", "Action"], duration: "1 season", match: 92, description: "A young boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.", backdrop: "linear-gradient(135deg,#1a000d 0%,#330019 45%,#1a000d 100%)", accent: "#f472b6", tag: "HD", streams: 13, seasons: 4 },
  { id: "tt0388629", title: "One Piece", year: 1999, rating: 8.7, genre: ["Anime", "Adventure"], duration: "20 seasons", match: 85, description: "Follow Monkey D. Luffy and his swashbuckling crew in their search for the ultimate treasure, the One Piece.", backdrop: "linear-gradient(135deg,#001833 0%,#003366 45%,#001833 100%)", accent: "#f97316", tag: "HD", streams: 7, seasons: 20 },
];

export const LIBRARY_ITEMS: LibraryItem[] = [
  { ...MOVIES[0], progress: 72, lastWatched: "2h ago", status: "watching" },
  { ...MOVIES[3], progress: 100, lastWatched: "Yesterday", status: "watched" },
  { ...SERIES[1], progress: 45, lastWatched: "3 days ago", status: "watching" },
  { ...MOVIES[6], progress: 0, lastWatched: "Added today", status: "watchlist" },
  { ...SERIES[3], progress: 28, lastWatched: "1 week ago", status: "watching" },
  { ...MOVIES[8], progress: 0, lastWatched: "Added 2 days ago", status: "watchlist" },
];

export const STREAM_SOURCES: StreamSource[] = [
  { quality: "4K HDR", size: "12.1 GB", seeds: 420, peers: 88, source: "YTS.mx", debrid: true, codec: "x265", audio: "Atmos", magnet: "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny" },
  { quality: "1080p", size: "8.4 GB", seeds: 892, peers: 203, source: "YTS.mx", debrid: false, codec: "x264", audio: "AAC", magnet: "magnet:?xt=urn:btih:08ddeade02af4cb48e235e168b9ceeff4de6734c&dn=Sintel" },
  { quality: "1080p BluRay", size: "5.4 GB", seeds: 345, peers: 67, source: "RARBG", debrid: true, codec: "x265", audio: "DTS", magnet: "magnet:?xt=urn:btih:20e248b1d9bf1efaf88b8e0b659c2288334863f6&dn=Tears+of+Steel" },
  { quality: "720p", size: "3.2 GB", seeds: 1240, peers: 380, source: "YTS.mx", debrid: false, codec: "x264", audio: "AAC", magnet: "magnet:?xt=urn:btih:e249cf1d73fd184ec507119ff94efaa4c2e43de9&dn=Cosmos+Laundromat" },
  { quality: "480p", size: "1.1 GB", seeds: 2100, peers: 640, source: "YTS.mx", debrid: false, codec: "x264", audio: "AAC", magnet: "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny" },
];

export const EP_TITLES = [
  "The Beginning", "Crossroads", "Fallout", "Reckoning", "Ashes",
  "The Long Night", "Homecoming", "Fracture", "Into the Dark", "Revelations",
  "The Pact", "Endgame", "Drift", "Echoes", "Threshold",
  "Aftermath", "The Gathering", "Nightfall", "Origins", "Last Light"
];

export function getSeasons(item: MediaItem): Season[] | null {
  if (!item.seasons) return null;
  const seasons: Season[] = [];
  for (let s = 1; s <= item.seasons; s++) {
    const count = 6 + ((s * 3) % 5);
    const eps = [];
    for (let e = 1; e <= count; e++) {
      const idx = (s * 7 + e * 3) % EP_TITLES.length;
      const num = parseInt((item.id.replace(/\D/g, "").slice(-2)) || "40", 10);
      eps.push({
        season: s,
        episode: e,
        title: EP_TITLES[idx],
        runtime: `${38 + ((s + e * 5) % 24)}m`,
        aired: `${2008 + ((s + item.year) % 12)}`,
        progress: (s === 1 && e === 1) ? 100 : (s === 1 && e === 2) ? Math.min(95, num) : 0,
        description: `Season ${s}, Episode ${e}. ${item.description}`,
        accent: item.accent,
        backdrop: item.backdrop,
      });
    }
    seasons.push({ season: s, episodes: eps });
  }
  return seasons;
}

export const DISCOVER_TYPES = [
  { id: "movie", label: "Movies", icon: "🎬", items: MOVIES },
  { id: "series", label: "Series", icon: "📺", items: SERIES },
  { id: "anime", label: "Anime", icon: "🌸", items: ANIME },
];

export const CATALOG_NAMES = ["Popular", "Featured", "Top Rated", "New Releases"];
export const GENRES = [
  "All", "Action", "Sci-Fi", "Drama", "Crime", "Thriller", "Romance",
  "Animation", "Adventure", "Fantasy", "Horror", "Documentary", "History", "Anime"
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 1, icon: "📺", title: "Stranger Things", sub: "S4E5 — new episode available", time: "2h ago", accent: "#818cf8", unread: true },
  { id: 2, icon: "⚡", title: "Torrentio", sub: "New 4K HDR stream for The Dark Knight", time: "5h ago", accent: "#facc15", unread: true },
  { id: 3, icon: "🌸", title: "Demon Slayer", sub: "S4E2 airs tomorrow", time: "1d ago", accent: "#f472b6", unread: false },
  { id: 4, icon: "⚙", title: "Streaming Server", sub: "Updated to v4.20.8", time: "2d ago", accent: "#34d399", unread: false },
];

export const SUB_TRACKS = ["Off", "English", "English [SDH]", "Spanish", "French", "German", "Portuguese", "Japanese", "Arabic", "Hindi"];
export const AUDIO_TRACKS = ["English 5.1", "English Atmos", "Original", "Commentary"];

const CAL_SERIES = SERIES.filter(s => s.seasons);
export const CALENDAR: CalendarDay[] = (() => {
  const out: CalendarDay[] = [];
  const base = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const items: any[] = [];
    CAL_SERIES.forEach((s, si) => {
      if ((i + si * 2) % 4 === 0) {
        const epNo = ((i + si) % 8) + 1;
        items.push({
          series: s,
          label: `S${s.seasons}E${epNo}`,
          title: EP_TITLES[(i + si * 3) % EP_TITLES.length]
        });
      }
    });
    out.push({ date: d, items });
  }
  return out;
})();

export const g = (o = 0.07, b = 20, e = 0.12): CSSProperties => ({
  background: `rgba(255,255,255,${o})`,
  backdropFilter: `blur(${b}px)`,
  WebkitBackdropFilter: `blur(${b}px)`,
  border: `1px solid rgba(255,255,255,${e})`,
});

export const parseDur = (d: string): number => {
  if (!d) return 8100;
  const h = /(\d+)\s*h/.exec(d);
  const m = /(\d+)\s*m/.exec(d);
  if (h || m) return (h ? +h[1] : 0) * 3600 + (m ? +m[1] : 0) * 60;
  return 8100;
};

export const fmtTime = (t: number): string => {
  t = Math.max(0, Math.floor(t));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};
