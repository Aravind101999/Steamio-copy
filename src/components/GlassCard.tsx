/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MediaItem } from "../types";
import Badge from "./Badge";

interface GlassCardProps {
  item: MediaItem & { progress?: number };
  onClick: (item: any) => void;
  wide?: boolean;
}

export default function GlassCard({ item, onClick, wide }: GlassCardProps) {
  const [hov, setHov] = useState(false);
  const w = wide ? 260 : 185;
  const h = wide ? 155 : 278;

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        background: item.backdrop,
        transition: "transform 0.38s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.35s ease",
        transform: hov ? "scale(1.07) translateY(-5px)" : "scale(1)",
        boxShadow: hov
          ? `0 20px 55px rgba(0,0,0,0.65),0 0 0 1.5px ${item.accent}55,0 0 35px ${item.accent}18`
          : "0 6px 20px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: w * 0.7,
          height: w * 0.7,
          borderRadius: "50%",
          background: `radial-gradient(circle,${item.accent}45 0%,transparent 70%)`,
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />

      {wide ? (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "30px 14px 14px",
            background: "linear-gradient(to top,rgba(0,0,0,0.92),transparent)",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "white",
              marginBottom: 4,
            }}
          >
            {item.title}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: item.accent }}>
              ★ {item.rating}
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "#ffffff55" }}>
              {item.year}
            </span>
            {item.tag && <Badge color={item.accent} sm>{item.tag}</Badge>}
          </div>
          {typeof item.progress === "number" && item.progress > 0 && item.progress < 100 && (
            <div style={{ marginTop: 8, height: 2, background: "rgba(255,255,255,0.15)", borderRadius: 1 }}>
              <div style={{ height: "100%", width: `${item.progress}%`, background: item.accent, borderRadius: 1 }} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              textAlign: "center",
              width: "85%",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "white",
                textShadow: `0 0 25px ${item.accent}`,
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.55rem",
                color: `${item.accent}cc`,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 6,
              }}
            >
              {item.genre[0]}
            </div>
          </div>
          {item.tag && (
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <Badge color={item.accent} sm>{item.tag}</Badge>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px 12px 11px",
              background: "linear-gradient(to top,rgba(0,0,0,0.95),transparent)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: "#ffffff66" }}>
                {item.duration}
              </span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", color: item.accent, fontWeight: 700 }}>
                ★ {item.rating}
              </span>
            </div>
          </div>
        </>
      )}

      {hov && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg,${item.accent}12,transparent 60%)`,
            border: `1px solid ${item.accent}35`,
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            ▶
          </div>
        </div>
      )}
    </div>
  );
}
