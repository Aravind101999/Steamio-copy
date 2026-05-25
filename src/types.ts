/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Addon {
  id: string;
  name: string;
  version: string;
  author: string;
  official: boolean;
  icon: string;
  description: string;
  catalogs: string[];
  installed: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  duration: string;
  match: number;
  description: string;
  backdrop: string;
  accent: string;
  tag: string;
  streams: number;
  seasons: number | null;
}

export interface LibraryItem extends MediaItem {
  progress: number;
  lastWatched: string;
  status: string;
}

export interface StreamSource {
  quality: string;
  size: string;
  seeds: number;
  peers: number;
  source: string;
  debrid: boolean;
  codec: string;
  audio: string;
  magnet?: string;
}

export interface Episode {
  season: number;
  episode: number;
  title: string;
  runtime: string;
  aired: string;
  progress: number;
  description: string;
  accent: string;
  backdrop: string;
}

export interface Season {
  season: number;
  episodes: Episode[];
}

export interface CalendarItem {
  series: MediaItem;
  label: string;
  title: string;
}

export interface CalendarDay {
  date: Date;
  items: CalendarItem[];
}

export interface NotificationItem {
  id: number;
  icon: string;
  title: string;
  sub: string;
  time: string;
  accent: string;
  unread: boolean;
}
