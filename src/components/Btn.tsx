/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  primary?: boolean;
  accent?: string;
}

export default function Btn({
  children,
  onClick,
  primary,
  accent = "#fff",
  style = {},
  ...rest
}: BtnProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.id !== id));
    }, 600);
  };

  return (
    <button
      onClick={(e) => {
        addRipple(e);
        onClick && onClick(e);
      }}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: "absolute",
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: primary ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.2)",
            animation: "ripple 0.6s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      ))}
    </button>
  );
}
