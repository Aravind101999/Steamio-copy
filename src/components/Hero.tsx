/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MediaItem } from "../types";
import Badge from "./Badge";
import Btn from "./Btn";
import { g } from "../data";

interface HeroProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onInfo: (item: MediaItem) => void;
}

export default function Hero({ item, onPlay, onInfo }: HeroProps) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    setVis(false);
    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, [item.id]);

  return (
    <div
      style={{
        position: "relative",
        height: "88vh",
        minHeight: 560,
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: item.backdrop,
          transition: "background 1.2s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "16%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(circle,${item.accent}38 0%,transparent 70%)`,
          filter: "blur(60px)",
          animation: "throb 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(circle,${item.accent}20 0%,transparent 70%)`,
          filter: "blur(75px)",
          animation: "throb 8s ease-in-out infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${item.accent}06 1px,transparent 1px),linear-gradient(90deg,${item.accent}06 1px,transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.38) 55%,transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top,rgba(0,0,0,0.96) 0%,transparent 52%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "0 68px 76px",
          maxWidth: 650,
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease,transform 0.8s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 30, height: 2, background: item.accent }} />
          <span
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.66rem",
              letterSpacing: "0.22em",
              color: item.accent,
              textTransform: "uppercase",
            }}
          >
            {item.genre[0]} · {item.year}
          </span>
          {item.tag && <Badge color={item.accent}>{item.tag}</Badge>}
          <Badge color="#1d4ed8">STREMIO</Badge>
        </div>
        <h1
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "clamp(2.2rem,4.5vw,3.8rem)",
            fontWeight: 900,
            color: "white",
            margin: "0 0 18px",
            lineHeight: 1.05,
            textShadow: `0 0 60px ${item.accent}40`,
          }}
        >
          {item.title}
        </h1>
        <div style={{ display: "flex", gap: 18, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { l: `★ ${item.rating}`, c: item.accent },
            { l: `${item.match}% Match`, c: "#4ade80" },
            { l: item.duration, c: "#ffffff70" },
            { l: `${item.streams} streams`, c: "#ffffff50" },
            { l: item.genre.join(" · "), c: "#ffffff40" },
          ].map((x, i) => (
            <span
              key={i}
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.7rem",
                color: x.c,
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {x.l}
            </span>
          ))}
        </div>
        <p
          style={{
            fontFamily: "Georgia,serif",
            fontSize: "0.93rem",
            color: "#ffffffcc",
            lineHeight: 1.78,
            margin: "0 0 34px",
            maxWidth: 490,
          }}
        >
          {item.description}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Btn
            onClick={() => onPlay(item)}
            primary
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "13px 30px",
              background: "white",
              color: "#07070f",
              border: "none",
              borderRadius: 10,
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: "0.06em",
            }}
          >
            ▶ PLAY
          </Btn>
          <Btn
            onClick={() => onInfo(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "13px 22px",
              ...g(0.1, 16, 0.18),
              color: "white",
              borderRadius: 10,
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: "0.8rem",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            ⓘ MORE INFO
          </Btn>
          <Btn
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "13px 18px",
              ...g(0.08, 16, 0.14),
              color: "white",
              borderRadius: 10,
              fontFamily: "'Space Mono',monospace",
              fontWeight: 700,
              fontSize: "0.8rem",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            + MY LIST
          </Btn>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, background: "linear-gradient(to top,#4f46e5,transparent)", zIndex: 5 }} />
    </div>
  );
}
