/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { MediaItem } from "../types";
import GlassCard from "./GlassCard";
import { g } from "../data";

interface RowProps {
  title: string;
  items: Array<MediaItem & { progress?: number }>;
  onSelect: (item: any) => void;
  accent?: string;
  wide?: boolean;
  sub?: string;
}

export default function Row({
  title,
  items,
  onSelect,
  accent = "#a855f7",
  wide,
  sub,
}: RowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (d: number) => {
    ref.current?.scrollBy({ left: d * 420, behavior: "smooth" });
  };

  return (
    <div style={{ marginBottom: 46 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 68px", marginBottom: 18 }}>
        <div style={{ width: 3, height: 18, background: accent, borderRadius: 2 }} />
        <div>
          <h2
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.86rem",
              fontWeight: 700,
              color: "white",
              margin: 0,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h2>
          {sub && (
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.08em",
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.6rem",
            color: accent,
            letterSpacing: "0.09em",
            cursor: "pointer",
            opacity: 0.8,
          }}
        >
          SEE ALL →
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => scroll(-1)}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: "50%",
            ...g(0.14, 12, 0.2),
            color: "white",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.17)",
          }}
        >
          ‹
        </button>
        <button
          onClick={() => scroll(1)}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: "50%",
            ...g(0.14, 12, 0.2),
            color: "white",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.17)",
          }}
        >
          ›
        </button>
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, width: 55, background: "linear-gradient(to right,#4f46e5,transparent)", zIndex: 5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 40, top: 0, bottom: 0, width: 55, background: "linear-gradient(to left,#4f46e5,transparent)", zIndex: 5, pointerEvents: "none" }} />
        <div
          ref={ref}
          style={{
            display: "flex",
            gap: 14,
            padding: "4px 68px 16px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {items.map((m) => (
            <GlassCard key={m.id} item={m} onClick={onSelect} wide={wide} />
          ))}
        </div>
      </div>
    </div>
  );
}
