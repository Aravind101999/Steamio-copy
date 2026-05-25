/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MediaItem, Episode } from "../types";
import Badge from "./Badge";
import { parseDur, fmtTime, AUDIO_TRACKS, SUB_TRACKS, g } from "../data";

interface PlayerProps {
  item: MediaItem;
  episode: Episode | null;
  streamUrl?: string | null;
  onClose: () => void;
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.4)",
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function Stepper({
  label,
  value,
  onMinus,
  onPlus,
}: {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 4px" }}>
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.6)" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onMinus}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            fontSize: "0.9rem",
          }}
        >
          −
        </button>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.68rem", color: "white", minWidth: 42, textAlign: "center" }}>
          {value}
        </span>
        <button
          onClick={onPlus}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            fontSize: "0.9rem",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

const panelRow = (active: boolean) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 11px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontFamily: "'Space Mono',monospace",
  fontSize: "0.7rem",
  textAlign: "left" as const,
  width: "100%",
  transition: "all 0.15s",
  background: active ? "rgba(250,204,21,0.22)" : "transparent",
  color: active ? "#facc15" : "rgba(255,255,255,0.7)",
});

export default function Player({ item, episode, streamUrl, onClose }: PlayerProps) {
  const total = parseDur(episode ? episode.runtime : item.duration);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [vol, setVol] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("1080p");
  const [sub, setSub] = useState("English");
  const [subSize, setSubSize] = useState(100);
  const [subDelay, setSubDelay] = useState(0);
  const [audio, setAudio] = useState(AUDIO_TRACKS[0]);
  const [panel, setPanel] = useState<string | null>(null);
  const [showUI, setShowUI] = useState(true);

  const barRef = useRef<HTMLDivElement>(null);
  const hideRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const changeTime = (targetTime: number) => {
    const clamped = Math.max(0, Math.min(total, targetTime));
    setTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  useEffect(() => {
    if (!playing || streamUrl) return;
    const t = setInterval(() => {
      setTime((p) => {
        const n = p + speed;
        if (n >= total) {
          setPlaying(false);
          return total;
        }
        return n;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, speed, total, streamUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = muted ? 0 : vol;
  }, [vol, muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
  }, [speed]);

  const wake = useCallback(() => {
    setShowUI(true);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setShowUI(false), 3200);
  }, []);

  useEffect(() => {
    wake();
    return () => {
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [wake]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight") {
        changeTime(time + 10);
      } else if (e.key === "ArrowLeft") {
        changeTime(time - 10);
      } else if (e.key === "ArrowUp") {
        setVol((v) => Math.min(1, v + 0.1));
        setMuted(false);
      } else if (e.key === "ArrowDown") {
        setVol((v) => Math.max(0, v - 0.1));
      } else if (e.key === "Escape") {
        onClose();
      }
      wake();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [total, time, onClose, wake]);

  const seek = (clientX: number) => {
    if (!barRef.current) return;
    const r = barRef.current.getBoundingClientRect();
    const targetPct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const nextTime = targetPct * total;
    setTime(nextTime);
    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }
  };

  const onBarDown = (e: React.MouseEvent<HTMLDivElement>) => {
    seek(e.clientX);
    const mv = (ev: MouseEvent) => seek(ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
  };

  const pct = total > 0 ? (time / total) * 100 : 0;
  const buffered = Math.min(100, pct + 18);

  const ctrlBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "1.15rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
  };

  const optBtn = (active: boolean): React.CSSProperties => ({
    ...ctrlBtn,
    fontSize: "0.66rem",
    fontFamily: "'Space Mono',monospace",
    fontWeight: 700,
    letterSpacing: "0.05em",
    padding: "6px 10px",
    color: active ? "#facc15" : "rgba(255,255,255,0.8)",
    background: active ? "rgba(250,204,21,0.2)" : "none",
  });

  return (
    <div
      onMouseMove={wake}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "#000",
        overflow: "hidden",
        cursor: showUI ? "default" : "none",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div onClick={() => setPlaying((p) => !p)} style={{ position: "absolute", inset: 0, background: streamUrl ? "#000" : item.backdrop }}>
        {streamUrl ? (
          <video
            ref={videoRef}
            src={streamUrl}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              setTime(Math.round(video.currentTime));
            }}
            autoPlay
            playsInline
          />
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: "32%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 600,
                height: 600,
                borderRadius: "50%",
                background: `radial-gradient(circle,${item.accent}30,transparent 70%)`,
                filter: "blur(80px)",
                animation: "throb 7s ease-in-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${item.accent}05 1px,transparent 1px),linear-gradient(90deg,${item.accent}05 1px,transparent 1px)`,
                backgroundSize: "80px 80px",
              }}
            />
          </>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom,rgba(0,0,0,0.55) 0%,transparent 24%,transparent 58%,rgba(0,0,0,0.88) 100%)",
            opacity: showUI ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        />
      </div>

      {sub !== "Off" && (
        <div
          style={{
            position: "absolute",
            bottom: showUI ? 128 : 56,
            left: 0,
            right: 0,
            textAlign: "center",
            transition: "bottom 0.35s",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(0,0,0,0.6)",
              padding: "4px 14px",
              borderRadius: 6,
              fontFamily: "sans-serif",
              fontSize: `${0.95 * subSize / 100}rem`,
              color: "white",
              textShadow: "0 2px 6px #000",
            }}
          >
            {playing ? "They told us it couldn't be done." : "❚❚ paused"}
          </span>
        </div>
      )}

      {!playing && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 96,
            height: 96,
            borderRadius: "50%",
            ...g(0.12, 18, 0.2),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.2rem",
            pointerEvents: "none",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          ▶
        </div>
      )}

      {/* top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: showUI ? 1 : 0,
          transform: showUI ? "translateY(0)" : "translateY(-12px)",
          transition: "all 0.35s",
          pointerEvents: showUI ? "auto" : "none",
        }}
      >
        <button onClick={onClose} style={ctrlBtn} title="Back (Esc)">
          ‹
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: "1.05rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
            {episode
              ? `S${episode.season} · E${episode.episode} · ${episode.title}`
              : `${item.year} · ${item.genre.join(" · ")}`}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <Badge color={item.accent}>{quality}</Badge>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.45)" }}>
          ⚡ Torrentio · {audio}
        </span>
      </div>

      {/* option panels */}
      {panel && (
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 116,
            width: 268,
            ...g(0.1, 26, 0.16),
            borderRadius: 14,
            padding: 16,
            zIndex: 5,
            animation: "slideIn 0.2s ease",
            boxShadow: "0 12px 50px rgba(0,0,0,0.6)",
          }}
        >
          {panel === "subs" && (
            <>
              <PanelTitle>Subtitles</PanelTitle>
              <div style={{ maxHeight: 168, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, marginBottom: 10 }}>
                {SUB_TRACKS.map((s) => (
                  <button key={s} onClick={() => setSub(s)} style={panelRow(sub === s)}>
                    {s}
                    {sub === s && <span>✓</span>}
                  </button>
                ))}
              </div>
              <Stepper label="Size" value={`${subSize}%`} onMinus={() => setSubSize((v) => Math.max(60, v - 10))} onPlus={() => setSubSize((v) => Math.min(180, v + 10))} />
              <Stepper label="Delay" value={`${subDelay > 0 ? "+" : ""}${subDelay.toFixed(1)}s`} onMinus={() => setSubDelay((v) => +(v - 0.5).toFixed(1))} onPlus={() => setSubDelay((v) => +(v + 0.5).toFixed(1))} />
            </>
          )}
          {panel === "audio" && (
            <>
              <PanelTitle>Audio Track</PanelTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {AUDIO_TRACKS.map((a) => (
                  <button key={a} onClick={() => setAudio(a)} style={panelRow(audio === a)}>
                    {a}
                    {audio === a && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
          {panel === "speed" && (
            <>
              <PanelTitle>Playback Speed</PanelTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button key={s} onClick={() => setSpeed(s)} style={panelRow(speed === s)}>
                    {s === 1 ? "Normal" : `${s}×`}
                    {speed === s && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
          {panel === "quality" && (
            <>
              <PanelTitle>Quality</PanelTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {["4K HDR", "1080p", "720p", "480p", "Auto"].map((qq) => (
                  <button key={qq} onClick={() => setQuality(qq)} style={panelRow(quality === qq)}>
                    {qq}
                    {quality === qq && <span>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 28px 22px",
          opacity: showUI ? 1 : 0,
          transform: showUI ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.35s",
          pointerEvents: showUI ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.66rem", color: "rgba(255,255,255,0.85)", minWidth: 54 }}>
            {fmtTime(time)}
          </span>
          <div ref={barRef} onMouseDown={onBarDown} style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.18)", position: "relative", cursor: "pointer" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${buffered}%`, background: "rgba(255,255,255,0.22)", borderRadius: 3 }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, background: item.accent, borderRadius: 3 }} />
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: "white", boxShadow: `0 0 10px ${item.accent}` }} />
          </div>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.66rem", color: "rgba(255,255,255,0.55)", minWidth: 54, textAlign: "right" }}>
            {fmtTime(total)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => changeTime(time - 10)} style={ctrlBtn} title="Back 10s">
            
          </button>
          <button onClick={() => setPlaying((p) => !p)} style={{ ...ctrlBtn, fontSize: "1.5rem", width: 44 }}>
            {playing ? "⏸" : "▶"}
          </button>
          <button onClick={() => changeTime(time + 10)} style={ctrlBtn} title="Forward 10s">
            
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: 6 }}>
            <button onClick={() => setMuted((m) => !m)} style={ctrlBtn}>
              {muted || vol === 0 ? "🔇" : vol < 0.5 ? "🔉" : "🔊"}
            </button>
            <div
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setVol(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
                setMuted(false);
              }}
              style={{ width: 78, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", position: "relative", cursor: "pointer" }}
            >
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${(muted ? 0 : vol) * 100}%`, background: "white", borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setPanel((p) => p === "speed" ? null : "speed")} style={optBtn(panel === "speed")}>
            {speed === 1 ? "1×" : `${speed}×`}
          </button>
          <button onClick={() => setPanel((p) => p === "subs" ? null : "subs")} style={optBtn(panel === "subs")} title="Subtitles">
            CC
          </button>
          <button onClick={() => setPanel((p) => p === "audio" ? null : "audio")} style={optBtn(panel === "audio")} title="Audio">
            🔈
          </button>
          <button onClick={() => setPanel((p) => p === "quality" ? null : "quality")} style={optBtn(panel === "quality")}>
            {quality}
          </button>
          {episode && (
            <button style={ctrlBtn} title="Next episode">
              ⏭
            </button>
          )}
          <button style={ctrlBtn} title="Picture in picture">
            ▭
          </button>
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                (document as any).exitFullscreen?.();
              } else {
                (document.documentElement as any).requestFullscreen?.();
              }
            }}
            style={ctrlBtn}
            title="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}
