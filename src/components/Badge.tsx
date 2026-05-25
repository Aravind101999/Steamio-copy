/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  sm?: boolean;
}

export default function Badge({ children, color = "#a855f7", sm }: BadgeProps) {
  return (
    <span
      style={{
        padding: sm ? "2px 6px" : "3px 10px",
        borderRadius: 5,
        fontSize: sm ? "0.52rem" : "0.6rem",
        fontWeight: 800,
        letterSpacing: "0.1em",
        fontFamily: "'Space Mono', monospace",
        background: color,
        color: "white",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
