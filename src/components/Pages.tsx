/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { MediaItem, LibraryItem, Addon, Episode } from "../types";
import { fetchTorBoxStream, getLocalConfig } from "../utils";
import {
  MOVIES,
  SERIES,
  ANIME,
  LIBRARY_ITEMS,
  ADDONS as INITIAL_ADDONS,
  DISCOVER_TYPES,
  CATALOG_NAMES,
  GENRES,
  CALENDAR,
  STREAM_SOURCES,
  getSeasons,
  g,
} from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import GlassCard from "./GlassCard";
import Hero from "./Hero";
import Row from "./Row";

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

interface HomePageProps {
  onPlay: (item: MediaItem, episode?: Episode | null) => void;
  onSelect: (item: MediaItem) => void;
}

export function HomePage({ onPlay, onSelect }: HomePageProps) {
  const all = [...MOVIES, ...SERIES];
  const [hero, setHero] = useState<MediaItem>(MOVIES[3]);
  const heroIdx = useRef(3);

  useEffect(() => {
    const t = setInterval(() => {
      heroIdx.current = (heroIdx.current + 1) % all.length;
      setHero(all[heroIdx.current]);
    }, 9000);
    return () => clearInterval(t);
  }, [all.length]);

  return (
    <div>
      <Hero item={hero} onPlay={onPlay} onInfo={onSelect} />
      <div style={{ display: "flex", gap: 7, justifyContent: "center", margin: "-16px 0 40px", position: "relative", zIndex: 20 }}>
        {all.map((m, i) => (
          <button
            key={m.id}
            onClick={() => {
              heroIdx.current = i;
              setHero(m);
            }}
            style={{
              width: heroIdx.current === i ? 26 : 7,
              height: 7,
              borderRadius: 4,
              background: heroIdx.current === i ? hero.accent : "rgba(255,255,255,0.18)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              padding: 0,
            }}
          />
        ))}
      </div>
      <Row title="Trending Movies" items={MOVIES} onSelect={onSelect} accent="#facc15" sub="Powered by Cinemeta · IMDB" />
      <Row title="Continue Watching" items={LIBRARY_ITEMS} onSelect={onSelect} accent="#f472b6" wide sub="From your library" />
      <Row title="Top Series" items={SERIES} onSelect={onSelect} accent="#34d399" sub="Powered by Cinemeta" />
      <Row title="Anime · Kitsu" items={ANIME} onSelect={onSelect} accent="#ec4899" sub="From Kitsu addon" />
      <Row title="4K & HDR Collection" items={MOVIES.filter((m) => m.tag?.includes("4K"))} onSelect={onSelect} accent="#fde047" sub="Best streams via Torrentio" />
      <div style={{ height: 60 }} />
    </div>
  );
}

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────

interface SearchPageProps {
  onSelect: (item: MediaItem) => void;
}

export function SearchPage({ onSelect }: SearchPageProps) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const all = [...MOVIES, ...SERIES, ...ANIME];
  const filters = ["All", "Movies", "Series", "Anime", "4K", "HD"];

  const results = all.filter((m) => {
    const mq =
      !q ||
      m.title.toLowerCase().includes(q.toLowerCase()) ||
      m.genre.some((gn) => gn.toLowerCase().includes(q.toLowerCase()));
    const mf =
      filter === "All" ||
      (filter === "Movies" && MOVIES.some((x) => x.id === m.id)) ||
      (filter === "Series" && SERIES.some((x) => x.id === m.id)) ||
      (filter === "Anime" && m.genre.includes("Anime")) ||
      m.tag?.includes(filter);
    return mq && mf;
  });

  return (
    <div style={{ padding: "32px 68px" }}>
      <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.5rem", fontWeight: 900, color: "white", margin: "0 0 28px", letterSpacing: "0.06em" }}>
        Search
      </h1>
      <div style={{ position: "relative", maxWidth: 580, marginBottom: 28 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Movies, series, genres…"
          autoFocus
          style={{
            width: "100%",
            padding: "15px 18px 15px 52px",
            ...g(0.07, 16, 0.15),
            color: "white",
            borderRadius: 13,
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.9rem",
            outline: "none",
            letterSpacing: "0.03em",
            boxSizing: "border-box",
          }}
        />
        <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", opacity: 0.38, fontSize: "1.15rem" }}>
          ⌕
        </span>
        {q && (
          <button
            onClick={() => setQ("")}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#ffffff55",
              fontSize: "1.15rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 38 }}>
        {filters.map((f) => (
          <Btn
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 18px",
              borderRadius: 20,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              border: "none",
              transition: "all 0.2s",
              ...(filter === f
                ? { background: "#facc15", color: "#000000" }
                : { ...g(0.07, 12, 0.13), color: "rgba(255,255,255,0.6)" }),
            }}
          >
            {f}
          </Btn>
        ))}
      </div>
      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "90px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono',monospace", fontSize: "0.82rem", letterSpacing: "0.14em" }}>
          NO RESULTS FOR "{q}"
        </div>
      ) : (
        <>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", marginBottom: 18 }}>
            {results.length} RESULTS
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {results.map((m) => (
              <GlassCard key={m.id} item={m} onClick={onSelect} />
            ))}
          </div>
        </>
      )}
      <div style={{ height: 60 }} />
    </div>
  );
}

// ─── LIBRARY PAGE ─────────────────────────────────────────────────────────────

interface LibraryPageProps {
  onSelect: (item: MediaItem) => void;
}

export function LibraryPage({ onSelect }: LibraryPageProps) {
  const [tab, setTab] = useState("watching");
  const tabs = [
    { id: "watching", label: "Watching", count: LIBRARY_ITEMS.filter((x) => x.status === "watching").length },
    { id: "watchlist", label: "Watchlist", count: LIBRARY_ITEMS.filter((x) => x.status === "watchlist").length },
    { id: "watched", label: "Watched", count: LIBRARY_ITEMS.filter((x) => x.status === "watched").length },
  ];
  const items = LIBRARY_ITEMS.filter((x) => x.status === tab);

  return (
    <div style={{ padding: "32px 68px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.5rem", fontWeight: 900, color: "white", margin: 0, letterSpacing: "0.06em" }}>
          My Library
        </h1>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>
          {LIBRARY_ITEMS.length} TITLES
        </span>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 38, ...g(0.06, 12, 0.1), borderRadius: 12, padding: 5, width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "9px 24px",
              borderRadius: 9,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.07em",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s",
              ...(tab === t.id
                ? { background: "rgba(255,255,255,0.13)", color: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }
                : { background: "transparent", color: "rgba(255,255,255,0.38)" }),
            }}
          >
            {t.label} <span style={{ opacity: 0.55 }}>({t.count})</span>
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "90px 0", color: "rgba(255,255,255,0.18)", fontFamily: "'Space Mono',monospace", fontSize: "0.82rem", letterSpacing: "0.14em" }}>
          NOTHING HERE YET
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                padding: 18,
                ...g(0.06, 16, 0.1),
                borderRadius: 14,
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateX(5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div style={{ width: 96, height: 58, borderRadius: 9, background: item.backdrop, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%,${item.accent}40,transparent 70%)` }} />
                <div style={{ position: "absolute", bottom: 5, left: 5, right: 5, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 1 }}>
                  {item.progress > 0 && <div style={{ height: "100%", width: `${item.progress}%`, background: item.accent, borderRadius: 1 }} />}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.95rem", fontWeight: 700, color: "white", marginBottom: 5 }}>
                  {item.title}
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.38)" }}>
                    {item.lastWatched}
                  </span>
                  {item.progress > 0 && item.progress < 100 && (
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: item.accent }}>
                      {item.progress}% watched
                    </span>
                  )}
                  {item.progress === 100 && (
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "#4ade80" }}>
                      ✓ Complete
                    </span>
                  )}
                  {item.tag && <Badge color={item.accent} sm>{item.tag}</Badge>}
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.25)" }}>
                    ★ {item.rating}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <Btn
                  style={{
                    padding: "8px 18px",
                    ...g(0.1, 12, 0.17),
                    color: "white",
                    borderRadius: 9,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.13)",
                  }}
                >
                  ▶ RESUME
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 60 }} />
    </div>
  );
}

// ─── ADDONS PAGE ──────────────────────────────────────────────────────────────

export function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>(INITIAL_ADDONS);
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState("installed");
  const [loading, setLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const toggle = (id: string) => {
    setLoading(id);
    setTimeout(() => {
      setAddons((prev) =>
        prev.map((a) => (a.id === id ? { ...a, installed: !a.installed } : a))
      );
      setLoading(null);
      const a = addons.find((x) => x.id === id);
      if (a) {
        setNotice(`${a.name} ${a.installed ? "uninstalled" : "installed"} successfully`);
        setTimeout(() => setNotice(null), 2500);
      }
    }, 900);
  };

  const displayed = tab === "installed" ? addons.filter((a) => a.installed) : addons.filter((a) => !a.installed);

  return (
    <div style={{ padding: "32px 68px" }}>
      {notice && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 30,
            zIndex: 9999,
            padding: "12px 22px",
            ...g(0.12, 20, 0.2),
            borderRadius: 11,
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.72rem",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.25)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            animation: "slideIn 0.3s ease",
          }}
        >
          ✓ {notice}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 18 }}>
        <div>
          <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.5rem", fontWeight: 900, color: "white", margin: "0 0 8px", letterSpacing: "0.06em" }}>
            Addon Manager
          </h1>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.32)", margin: 0, letterSpacing: "0.08em" }}>
            {addons.filter((a) => a.installed).length} ADDONS INSTALLED · EXTEND STREMIO WITH COMMUNITY ADDONS
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste addon manifest URL…"
            style={{
              padding: "10px 16px",
              ...g(0.07, 16, 0.13),
              color: "white",
              borderRadius: 10,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.72rem",
              outline: "none",
              width: 300,
              boxSizing: "border-box",
              letterSpacing: "0.02em",
            }}
          />
          <Btn
            style={{
              padding: "10px 20px",
              background: "#facc15",
              border: "none",
              borderRadius: 10,
              color: "#000000",
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            INSTALL
          </Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, ...g(0.05, 12, 0.09), borderRadius: 11, padding: 5, width: "fit-content" }}>
        {[
          { id: "installed", label: `Installed (${addons.filter((a) => a.installed).length})` },
          { id: "browse", label: "Browse Community" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 22px",
              borderRadius: 8,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s",
              ...(tab === t.id
                ? { background: "rgba(255,255,255,0.13)", color: "white" }
                : { background: "transparent", color: "rgba(255,255,255,0.36)" }),
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {displayed.map((a) => (
          <div
            key={a.id}
            style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", ...g(0.06, 16, 0.1), borderRadius: 14, transition: "all 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.65rem",
                flexShrink: 0,
              }}
            >
              {a.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.95rem", fontWeight: 700, color: "white" }}>{a.name}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>
                  v{a.version}
                </span>
                {a.official && <Badge color="#2563eb" sm>OFFICIAL</Badge>}
              </div>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.42)", margin: "0 0 8px", lineHeight: 1.55 }}>
                {a.description}
              </p>
              {a.catalogs.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {a.catalogs.map((c) => (
                    <span
                      key={c}
                      style={{
                        padding: "2px 8px",
                        ...g(0.06, 8, 0.1),
                        borderRadius: 5,
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "0.56rem",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
              {a.installed && (
                <Btn
                  style={{
                    padding: "7px 14px",
                    ...g(0.06, 10, 0.12),
                    color: "rgba(255,255,255,0.5)",
                    borderRadius: 8,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  ⚙ CONFIG
                </Btn>
              )}
              <Btn
                onClick={() => toggle(a.id)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 9,
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  border: "none",
                  transition: "all 0.25s",
                  minWidth: 100,
                  ...(a.installed
                    ? { background: "rgba(239,68,68,0.14)", color: "#f87171", border: "1px solid rgba(239,68,68,0.22)" }
                    : { background: "#facc15", color: "#000000" }),
                }}
              >
                {loading === a.id ? "···" : a.installed ? "REMOVE" : "INSTALL"}
              </Btn>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [cfg, setCfg] = useState(() => {
    const saved = localStorage.getItem("sg_stremio_cfg");
    const defaults = {
      quality: "4K",
      subtitles: true,
      hardwareDec: true,
      autoplay: true,
      serverUrl: "https://streaming.strem.io",
      language: "English",
      debrid: "none",
      torboxApiKey: "",
      notifications: true,
      autoUpdate: true,
      analytics: false,
      subtitleSize: "medium",
      subtitleColor: "white",
    };
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch {
        return defaults;
      }
    }
    return defaults;
  });

  const setConfig = (k: string, v: any) => {
    setCfg((p) => {
      const next = { ...p, [k]: v };
      localStorage.setItem("sg_stremio_cfg", JSON.stringify(next));
      window.dispatchEvent(new Event("storage"));
      return next;
    });
  };

  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 38 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ fontSize: "1rem" }}>{icon}</span>
        <div style={{ width: 3, height: 16, background: "#facc15", borderRadius: 2 }} />
        <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: "0.8rem", fontWeight: 700, color: "white", margin: 0, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {title}
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>{children}</div>
    </div>
  );

  const SettingRow = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", ...g(0.055, 14, 0.09), borderRadius: 11, gap: 24 }}>
      <div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.76rem", fontWeight: 700, color: "rgba(255,255,255,0.84)", letterSpacing: "0.04em" }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.28)", marginTop: 3, letterSpacing: "0.04em" }}>
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ val, onChange }: { val: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: val ? "#facc15" : "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.28s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: 2,
          left: val ? 23 : 3,
          transition: "left 0.28s",
          boxShadow: "0 1px 5px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );

  const Sel = ({ val, options, onChange }: { val: string; options: string[]; onChange: (v: string) => void }) => (
    <select
      value={val}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "7px 14px",
        ...g(0.09, 12, 0.14),
        color: "white",
        borderRadius: 9,
        fontFamily: "'Space Mono',monospace",
        fontSize: "0.7rem",
        fontWeight: 700,
        outline: "none",
        cursor: "pointer",
        letterSpacing: "0.04em",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  return (
    <div style={{ padding: "32px 68px", maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.5rem", fontWeight: 900, color: "white", margin: "0 0 38px", letterSpacing: "0.06em" }}>
        Settings
      </h1>
      <Section title="Playback" icon="▶">
        <SettingRow label="Streaming Quality" sub="Maximum resolution for streams">
          <Sel val={cfg.quality} options={["Auto", "4K", "1080p", "720p", "480p"]} onChange={(v) => setConfig("quality", v)} />
        </SettingRow>
        <SettingRow label="Hardware Decoding" sub="Use GPU for smoother 4K playback">
          <Toggle val={cfg.hardwareDec} onChange={() => setConfig("hardwareDec", !cfg.hardwareDec)} />
        </SettingRow>
        <SettingRow label="Autoplay Next Episode" sub="Automatically play next episode in series">
          <Toggle val={cfg.autoplay} onChange={() => setConfig("autoplay", !cfg.autoplay)} />
        </SettingRow>
      </Section>
      <Section title="Subtitles" icon="💬">
        <SettingRow label="Subtitles" sub="Show subtitles when available">
          <Toggle val={cfg.subtitles} onChange={() => setConfig("subtitles", !cfg.subtitles)} />
        </SettingRow>
        <SettingRow label="Language" sub="Preferred subtitle language">
          <Sel val={cfg.language} options={["English", "Spanish", "French", "German", "Portuguese", "Japanese", "Arabic", "Hindi"]} onChange={(v) => setConfig("language", v)} />
        </SettingRow>
        <SettingRow label="Subtitle Size">
          <Sel val={cfg.subtitleSize} options={["small", "medium", "large", "x-large"]} onChange={(v) => setConfig("subtitleSize", v)} />
        </SettingRow>
      </Section>
      <Section title="Streaming Server" icon="📡">
        <SettingRow label="Server URL" sub={cfg.serverUrl}>
          <Btn
            style={{
              padding: "7px 16px",
              ...g(0.09, 12, 0.14),
              color: "rgba(255,255,255,0.7)",
              borderRadius: 9,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.68rem",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            EDIT
          </Btn>
        </SettingRow>
        <SettingRow label="Auto-Update" sub="Keep streaming server up to date">
          <Toggle val={cfg.autoUpdate} onChange={() => setConfig("autoUpdate", !cfg.autoUpdate)} />
        </SettingRow>
      </Section>
      <Section title="Debrid Services" icon="⚡">
        <SettingRow label="Real-Debrid / Premiumize / TorBox" sub="Connect for premium cached streams">
          <Sel val={cfg.debrid} options={["none", "TorBox", "Real-Debrid", "Premiumize", "AllDebrid", "Debrid-Link", "Offcloud"]} onChange={(v) => setConfig("debrid", v)} />
        </SettingRow>
        {cfg.debrid === "TorBox" && (
          <SettingRow label="TorBox API Key" sub="Paste your TorBox bearer developer token">
            <input
              type="password"
              placeholder="torbox_xxxxxxxxxxxxxxxx"
              value={cfg.torboxApiKey || ""}
              onChange={(e) => setConfig("torboxApiKey", e.target.value)}
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#fff",
                fontSize: "0.74rem",
                fontFamily: "'Space Mono',monospace",
                width: 250,
                outline: "none",
                textAlign: "left",
              }}
            />
          </SettingRow>
        )}
        {cfg.debrid !== "none" && cfg.debrid !== "TorBox" && (
          <SettingRow label="API Key" sub="Paste your debrid API key">
            <Btn
              style={{
                padding: "7px 18px",
                ...g(0.09, 12, 0.14),
                color: "#facc15",
                borderRadius: 9,
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.68rem",
                fontWeight: 700,
                border: "1px solid rgba(250,204,21,0.38)",
              }}
            >
              CONNECT
            </Btn>
          </SettingRow>
        )}
      </Section>
      <Section title="General" icon="⚙">
        <SettingRow label="Push Notifications" sub="Get notified about new releases">
          <Toggle val={cfg.notifications} onChange={() => setConfig("notifications", !cfg.notifications)} />
        </SettingRow>
        <SettingRow label="Anonymous Analytics" sub="Help improve Stremio with usage data">
          <Toggle val={cfg.analytics} onChange={() => setConfig("analytics", !cfg.analytics)} />
        </SettingRow>
      </Section>
      <div style={{ height: 60 }} />
    </div>
  );
}

// ─── DISCOVER PAGE ────────────────────────────────────────────────────────────

interface DiscoverPageProps {
  onSelect: (item: MediaItem) => void;
}

export function DiscoverPage({ onSelect }: DiscoverPageProps) {
  const [type, setType] = useState(DISCOVER_TYPES[0].id);
  const [genre, setGenre] = useState("All");
  const [catalog, setCatalog] = useState("Popular");
  const pool = DISCOVER_TYPES.find((t) => t.id === type)?.items || [];
  const results = pool.filter((m) => genre === "All" || m.genre.includes(genre));

  const selectStyle: React.CSSProperties = {
    padding: "8px 14px",
    ...g(0.07, 12, 0.13),
    color: "white",
    borderRadius: 9,
    fontFamily: "'Space Mono',monospace",
    fontSize: "0.7rem",
    outline: "none",
    cursor: "pointer",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ padding: "24px 68px 60px" }}>
      <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 6px", letterSpacing: "0.06em" }}>
        Discover
      </h1>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.66rem", color: "rgba(255,255,255,0.3)", margin: "0 0 26px", letterSpacing: "0.08em" }}>
        BROWSE CATALOGS FROM YOUR INSTALLED ADDONS
      </p>
      <div style={{ display: "flex", gap: 4, marginBottom: 18, ...g(0.05, 12, 0.09), borderRadius: 12, padding: 5, width: "fit-content" }}>
        {DISCOVER_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setType(t.id);
              setGenre("All");
            }}
            style={{
              padding: "9px 22px",
              borderRadius: 9,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s",
              ...(type === t.id
                ? { background: "rgba(255,255,255,0.13)", color: "white" }
                : { background: "transparent", color: "rgba(255,255,255,0.4)" }),
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }}>
        <select value={catalog} onChange={(e) => setCatalog(e.target.value)} style={selectStyle}>
          {CATALOG_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {GENRES.map((gn) => (
            <button
              key={gn}
              onClick={() => setGenre(gn)}
              style={{
                padding: "6px 14px",
                borderRadius: 18,
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.64rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.18s",
                ...(genre === gn
                  ? { background: "#facc15", color: "#000000" }
                  : { ...g(0.06, 12, 0.12), color: "rgba(255,255,255,0.55)" }),
              }}
            >
              {gn}
            </button>
          ))}
        </div>
      </div>
      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono',monospace", fontSize: "0.8rem", letterSpacing: "0.14em" }}>
          NO TITLES IN THIS CATALOG
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {results.map((m) => (
            <GlassCard key={m.id} item={m} onClick={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────

interface CalendarPageProps {
  onSelect: (item: MediaItem) => void;
}

export function CalendarPage({ onSelect }: CalendarPageProps) {
  const today = new Date();
  const fmtD = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  return (
    <div style={{ padding: "24px 68px 60px" }}>
      <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 6px", letterSpacing: "0.06em" }}>
        Calendar
      </h1>
      <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.66rem", color: "rgba(255,255,255,0.3)", margin: "0 0 26px", letterSpacing: "0.08em" }}>
        UPCOMING EPISODES FROM SERIES IN YOUR LIBRARY
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {CALENDAR.map((day, i) => {
          const isToday = day.date.toDateString() === today.toDateString();
          return (
            <div key={i} style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
              <div style={{ width: 104, flexShrink: 0, textAlign: "right", paddingTop: 13 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", fontWeight: 700, color: isToday ? "#facc15" : "rgba(255,255,255,0.7)" }}>
                  {isToday ? "TODAY" : fmtD(day.date).toUpperCase()}
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, borderLeft: `2px solid ${isToday ? "#facc15" : "rgba(255,255,255,0.08)"}`, paddingLeft: 18, paddingBottom: 8 }}>
                {day.items.length === 0 ? (
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.14)", padding: "11px 0" }}>
                    No new episodes
                  </div>
                ) : (
                  day.items.map((it: any, j: number) => (
                    <div
                      key={j}
                      onClick={() => onSelect(it.series)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 16px",
                        ...g(0.06, 14, 0.1),
                        borderRadius: 12,
                        cursor: "pointer",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(4px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
                    >
                      <div style={{ width: 54, height: 34, borderRadius: 7, background: it.series.backdrop, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle,${it.series.accent}40,transparent 70%)` }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{it.series.title}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>{it.title}</div>
                      </div>
                      <Badge color={it.series.accent} sm>{it.label}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EPISODES PANEL ───────────────────────────────────────────────────────────

interface EpisodesPanelProps {
  item: MediaItem;
  onPlay: (item: MediaItem, ep: Episode) => void;
}

export function EpisodesPanel({ item, onPlay }: EpisodesPanelProps) {
  const seasons = getSeasons(item) || [];
  const [sel, setSel] = useState(seasons[0]?.season || 1);
  const current = seasons.find((s) => s.season === sel) || seasons[0];

  return (
    <>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
        {seasons.map((s) => (
          <button
            key={s.season}
            onClick={() => setSel(s.season)}
            style={{
              padding: "7px 16px",
              borderRadius: 9,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.66rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              border: "none",
              cursor: "pointer",
              transition: "all 0.18s",
              ...(sel === s.season
                ? { background: item.accent, color: "white" }
                : { ...g(0.06, 12, 0.12), color: "rgba(255,255,255,0.55)" }),
            }}
          >
            Season {s.season}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {current?.episodes.map((ep) => (
          <div
            key={ep.episode}
            onClick={() => onPlay(item, ep)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 14px",
              borderRadius: 12,
              cursor: "pointer",
              transition: "background 0.18s",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.03)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
          >
            <div style={{ width: 74, height: 44, borderRadius: 8, background: ep.backdrop, flexShrink: 0, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle,${ep.accent}40,transparent 70%)` }} />
              <span style={{ position: "relative", fontSize: "0.95rem" }}>▶</span>
              {ep.progress > 0 && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,0.4)" }}>
                  <div style={{ height: "100%", width: `${ep.progress}%`, background: ep.accent }} />
                </div>
              )}
            </div>
            <div style={{ width: 30, textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
              {ep.episode}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: "0.88rem", fontWeight: 700, color: "white", marginBottom: 2 }}>{ep.title}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.35)" }}>{ep.runtime} · {ep.aired}</div>
            </div>
            {ep.progress === 100 && (
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "#4ade80", flexShrink: 0 }}>✓</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────

interface DetailModalProps {
  item: MediaItem;
  onClose: () => void;
  onPlay: (item: MediaItem, episode: Episode | null, streamUrl?: string | null) => void;
  onSelect: (item: MediaItem) => void;
}

export function DetailModal({ item, onClose, onPlay, onSelect }: DetailModalProps) {
  const isSeries = typeof item.seasons === "number";
  const [selStream, setSelStream] = useState(0);
  const [tab, setTab] = useState(isSeries ? "episodes" : "streams");
  const tabs = isSeries ? ["episodes", "streams", "related"] : ["streams", "related"];
  const related = [...MOVIES, ...SERIES, ...ANIME].filter((m) => m.id !== item.id && m.genre.some((g) => item.genre.includes(g))).slice(0, 4);

  const [customMagnet, setCustomMagnet] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const handlePlayMagnet = async (magnetStr: string, label: string = "Custom Torrent Stream") => {
    if (!magnetStr) return;
    setResolveError(null);
    setResolving(label);
    try {
      const config = getLocalConfig();
      const apiKey = config.debrid === "TorBox" ? config.torboxApiKey : "";
      
      const res = await fetchTorBoxStream(magnetStr, apiKey);
      if (res.error) {
        if (res.error === "metadata_dl") {
          setResolveError(res.message || "TorBox is caching metadata. Give it a few seconds and try executing play again.");
        } else {
          setResolveError(res.error);
        }
        setResolving(null);
      } else if (res.streamUrl) {
        setResolving(null);
        onPlay(item, null, res.streamUrl);
        onClose();
      }
    } catch (e: any) {
      setResolveError(e.message || "An expected network error happened while contacting TorBox.");
      setResolving(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        animation: "fadeIn 0.22s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {resolving && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 100,
            background: "rgba(10,10,18,0.94)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.1)",
              borderTopColor: item.accent,
              animation: "spin 1s linear infinite",
              marginBottom: 20,
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: "1.25rem", fontWeight: 700, marginBottom: 8, textAlign: "center", color: "#fff" }}>
            Resolving TorBox Stream
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", marginBottom: 20, textAlign: "center", maxWidth: 400, wordBreak: "break-all" }}>
            {resolving}
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: "#facc15", marginBottom: 24, textAlign: "center", maxWidth: 350 }}>
            Placing download order & retrieving cached direct CDN stream links...
          </div>
          <button
            onClick={() => setResolving(null)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: "0.7rem",
              fontFamily: "'Space Mono',monospace",
              cursor: "pointer",
            }}
          >
            CANCEL REQUEST
          </button>
        </div>
      )}

      <div style={{ width: "min(820px,96vw)", maxHeight: "92vh", overflowY: "auto", ...g(0.07, 24, 0.13), borderRadius: 22, scrollbarWidth: "none" }}>
        {/* Hero band */}
        <div style={{ height: 220, background: item.backdrop, position: "relative", overflow: "hidden", borderRadius: "22px 22px 0 0" }}>
          <div style={{ position: "absolute", top: "20%", right: "20%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${item.accent}50 0%,transparent 70%)`, filter: "blur(50px)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.95) 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 30px 22px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                {item.tag && <Badge color={item.accent}>{item.tag}</Badge>}
                {item.genre.map((gr) => (
                  <Badge key={gr} color="rgba(255,255,255,0.15)" sm>
                    {gr}
                  </Badge>
                ))}
              </div>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.6rem", fontWeight: 900, color: "white", margin: 0 }}>{item.title}</h2>
              <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                {[`★ ${item.rating}`, item.year, item.duration].map((x, i) => (
                  <span key={i} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: i === 0 ? item.accent : "rgba(255,255,255,0.5)", fontWeight: i === 0 ? 700 : 400 }}>
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                ...g(0.1, 12, 0.15),
                borderRadius: "50%",
                color: "rgba(255,255,255,0.6)",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.12)",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ padding: "24px 30px" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: "0.9rem", color: "#ffffffbb", lineHeight: 1.75, margin: "0 0 22px" }}>{item.description}</p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 22, ...g(0.05, 10, 0.08), borderRadius: 10, padding: 4, width: "fit-content" }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "7px 20px",
                  borderRadius: 8,
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  ...(tab === t
                    ? { background: "rgba(255,255,255,0.13)", color: "white" }
                    : { background: "transparent", color: "rgba(255,255,255,0.36)" }),
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "episodes" && isSeries && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em" }}>
                  EPISODES · {item.seasons} SEASON{item.seasons && item.seasons > 1 ? "S" : ""}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>
              <EpisodesPanel item={item} onPlay={onPlay} />
            </>
          )}

          {tab === "streams" && (
            <>
              {/* Custom Magnet Resolver */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>STREAM VIA CUSTOM MAGNET</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="magnet:?xt=urn:btih:..."
                    value={customMagnet}
                    onChange={(e) => setCustomMagnet(e.target.value)}
                    style={{
                      flex: 1,
                      background: "rgba(0,0,0,0.22)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      padding: "9px 14px",
                      color: "#fff",
                      fontSize: "0.74rem",
                      fontFamily: "'Space Mono',monospace",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => handlePlayMagnet(customMagnet, "Custom Torrent Stream")}
                    style={{
                      padding: "8px 18px",
                      background: item.accent,
                      border: "none",
                      color: "#000",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    RESOLVE
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {resolveError && (
                <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, marginBottom: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", fontWeight: 700, color: "#f87171", letterSpacing: "0.08em" }}>TORBOX ENCOUNTERED ERROR</span>
                  <p style={{ margin: 0, fontSize: "0.74rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{resolveError}</p>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em" }}>CHOOSE TORRENT LINK</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {STREAM_SOURCES.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelStream(i);
                      setResolveError(null);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      padding: "14px 18px",
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "all 0.25s",
                      border: `1px solid ${selStream === i ? `${item.accent}55` : "rgba(255,255,255,0.07)"}`,
                      background: selStream === i ? `${item.accent}12` : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: selStream === i ? item.accent : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.76rem", fontWeight: 800, color: selStream === i ? "white" : "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>{s.quality}</span>
                          {s.debrid && <Badge color="#f59e0b" sm>⚡ DEBRID</Badge>}
                          <Badge color="rgba(255,255,255,0.1)" sm>{s.codec}</Badge>
                          <Badge color="rgba(255,255,255,0.1)" sm>{s.audio}</Badge>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.32)" }}>{s.size}</span>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "#4ade8090" }}>▲ {s.seeds}</span>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.28)" }}>▼ {s.peers}</span>
                          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.22)" }}>{s.source}</span>
                        </div>
                      </div>
                    </div>

                    {selStream === i && (
                      <div style={{ display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, marginTop: 4 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (s.magnet) {
                              handlePlayMagnet(s.magnet, `${item.title} (${s.quality})`);
                            } else {
                              setResolveError("This mock stream does not have an associated magnet link. Please try adding one inside Custom Magnet instead!");
                            }
                          }}
                          style={{
                            background: item.accent,
                            border: "none",
                            color: "#000",
                            fontFamily: "'Space Mono',monospace",
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "7px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          ⚡ STREAM WITH TORBOX
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlay(item, null);
                            onClose();
                          }}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "none",
                            color: "#fff",
                            fontFamily: "'Space Mono',monospace",
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            padding: "7px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                        >
                          PLAY SIMULATION
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "related" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {related.length === 0 ? (
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>No related titles found</div>
              ) : (
                related.map((m) => <GlassCard key={m.id} item={m} onClick={(x) => onSelect(x)} />)
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <Btn
              onClick={() => {
                const s = getSeasons(item);
                onPlay(item, s ? s[0].episodes[0] : null);
              }}
              primary
              style={{
                flex: 1,
                minWidth: 140,
                padding: "14px",
                background: "white",
                color: "#07070f",
                border: "none",
                borderRadius: 11,
                fontFamily: "'Space Mono',monospace",
                fontWeight: 800,
                fontSize: "0.8rem",
                letterSpacing: "0.07em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              ▶ {isSeries ? "PLAY S1·E1" : "PLAY NOW"}
            </Btn>
            <Btn style={{ padding: "14px 22px", ...g(0.09, 16, 0.16), color: "white", borderRadius: 11, fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.13)" }}>⬇ DOWNLOAD</Btn>
            <Btn style={{ padding: "14px 22px", ...g(0.09, 16, 0.16), color: "white", borderRadius: 11, fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.13)" }}>📺 CAST</Btn>
            <Btn style={{ padding: "14px 22px", ...g(0.09, 16, 0.16), color: "white", borderRadius: 11, fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "0.78rem", border: "1px solid rgba(255,255,255,0.13)" }}>+ WATCHLIST</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
