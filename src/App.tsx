/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { MediaItem, Episode } from "./types";
import { NOTIFICATIONS, g } from "./data";
import Btn from "./components/Btn";
import Player from "./components/Player";
import {
  HomePage,
  DiscoverPage,
  SearchPage,
  CalendarPage,
  LibraryPage,
  AddonsPage,
  SettingsPage,
  DetailModal,
} from "./components/Pages";

const NAV = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "discover", icon: "◎", label: "Discover" },
  { id: "search", icon: "⌕", label: "Search" },
  { id: "calendar", icon: "▦", label: "Calendar" },
  { id: "library", icon: "▣", label: "Library" },
  { id: "addons", icon: "⊞", label: "Addons" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [modal, setModal] = useState<MediaItem | null>(null);
  const [player, setPlayer] = useState<{ item: MediaItem; episode: Episode | null; streamUrl?: string | null } | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 50);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  const goPage = (id: string) => {
    setPage(id);
    setNotifOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const openDetail = (item: MediaItem) => {
    setPlayer(null);
    setModal(item);
  };

  const openPlayer = (item: MediaItem, episode: Episode | null = null, streamUrl: string | null = null) => {
    setModal(null);
    setPlayer({ item, episode, streamUrl });
  };

  return (
    <div className="sg-root" style={{ display: "flex", background: "linear-gradient(135deg,#4f46e5 0%,#6366f1 100%)", color: "white", overflow: "hidden", height: "100vh", position: "relative" }}>
      {/* FLOATING VIBRANT SHAPES */}
      <div
        className="floating-shape-1"
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          background: "#ec4899", // tailwind pink-500
          borderRadius: "50%",
          top: "-50px",
          left: "-50px",
          filter: "blur(60px)",
          opacity: 0.5,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        className="floating-shape-2"
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background: "#facc15", // tailwind yellow-400
          borderRadius: "50%",
          bottom: "-120px",
          right: "-50px",
          filter: "blur(70px)",
          opacity: 0.45,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* SIDEBAR NAVIGATION */}
      <nav
        style={{
          position: "relative",
          width: 72,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "22px 0",
          gap: 6,
          ...g(0.12, 14, 0.2), // slightly stronger glass card in vibrant theme
          borderRight: "1px solid rgba(255,255,255,0.15)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg,#f472b6,#facc15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            marginBottom: 16,
            boxShadow: "0 0 22px rgba(250,204,21,0.5)",
            cursor: "pointer",
          }}
          onClick={() => goPage("home")}
        >
          ◈
        </div>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => goPage(n.id)}
            title={n.label}
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.12rem",
              cursor: "pointer",
              border: "none",
              transition: "all 0.22s",
              ...(page === n.id
                ? { background: "rgba(250,204,21,0.22)", border: "1px solid rgba(250,204,21,0.38)", color: "#facc15", boxShadow: "0 4px 18px rgba(250,204,21,0.25)" }
                : { background: "transparent", color: "rgba(255,255,255,0.45)" }),
            }}
          >
            {n.icon}
          </button>
        ))}
        <div
          style={{
            marginTop: "auto",
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#f472b6,#facc15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Space Mono',monospace",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            boxShadow: "0 0 0 2px rgba(250,204,21,0.38)",
          }}
        >
          U
        </div>
      </nav>

      {/* MAIN LAYOUT WRAPPER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 10 }}>
        
        {/* TOP COMPACT TITLEBAR */}
        <div
          style={{
            height: 58,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            padding: "0 36px",
            gap: 16,
            flexShrink: 0,
            transition: "all 0.35s",
            ...(scrolled
              ? { ...g(0.12, 14, 0.2), borderBottom: "1px solid rgba(255,255,255,0.12)" }
              : { background: "transparent" }),
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontWeight: 900,
              fontSize: "0.8rem",
              letterSpacing: "0.18em",
              background: "linear-gradient(90deg,#f472b6,#facc15)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => goPage("home")}
          >
            STREAMGLASS
          </span>
          <div style={{ flex: 1 }} />
          <Btn
            onClick={() => goPage("search")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 16px",
              ...g(0.1, 10, 0.18),
              color: "rgba(255,255,255,0.8)",
              borderRadius: 9,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.22)",
              letterSpacing: "0.06em",
            }}
          >
            ⌕ SEARCH
          </Btn>
          <Btn
            style={{
              padding: "7px 16px",
              ...g(0.07, 12, 0.12),
              color: "rgba(255,255,255,0.48)",
              borderRadius: 9,
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.1)",
              letterSpacing: "0.06em",
            }}
          >
            📡 SERVER
          </Btn>
          <div style={{ position: "relative" }}>
            <Btn
              onClick={() => setNotifOpen((o) => !o)}
              style={{
                position: "relative",
                width: 36,
                height: 36,
                ...g(0.07, 12, 0.12),
                color: "rgba(255,255,255,0.6)",
                borderRadius: 9,
                fontSize: "0.95rem",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🔔
              {NOTIFICATIONS.some((n) => n.unread) && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 7,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#f87171",
                    boxShadow: "0 0 5px #f87171",
                  }}
                />
              )}
            </Btn>
            {notifOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 46,
                  right: 0,
                  width: 320,
                  ...g(0.1, 26, 0.16),
                  borderRadius: 14,
                  padding: 8,
                  zIndex: 200,
                  boxShadow: "0 14px 50px rgba(0,0,0,0.6)",
                  animation: "slideIn 0.2s ease",
                }}
              >
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", padding: "8px 10px 10px" }}>
                  Notifications
                </div>
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      gap: 11,
                      alignItems: "flex-start",
                      padding: "10px",
                      borderRadius: 10,
                      transition: "background 0.15s",
                      cursor: "pointer",
                      background: n.unread ? "rgba(255,255,255,0.04)" : "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? "rgba(255,255,255,0.04)" : "transparent")}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${n.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", fontWeight: 700, color: "white" }}>{n.title}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.4 }}>{n.sub}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.52rem", color: "rgba(255,255,255,0.28)", marginTop: 3 }}>{n.time}</div>
                    </div>
                    {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.accent, flexShrink: 0, marginTop: 4 }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} title="Server online" />
        </div>

        {/* SCROLL AREA */}
        <div ref={mainRef} style={{ flex: 1, overflowY: "auto", marginTop: page === "home" ? -58 : 0 }}>
          {page === "home" && <HomePage onPlay={openPlayer} onSelect={openDetail} />}
          {page === "discover" && <DiscoverPage onSelect={openDetail} />}
          {page === "search" && <SearchPage onSelect={openDetail} />}
          {page === "calendar" && <CalendarPage onSelect={openDetail} />}
          {page === "library" && <LibraryPage onSelect={openDetail} />}
          {page === "addons" && <AddonsPage />}
          {page === "settings" && <SettingsPage />}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {modal && <DetailModal item={modal} onClose={() => setModal(null)} onPlay={openPlayer} onSelect={openDetail} />}

      {/* VIDEO PLAYER OVERLAY */}
      {player && <Player item={player.item} episode={player.episode} streamUrl={player.streamUrl} onClose={() => setPlayer(null)} />}
    </div>
  );
}
