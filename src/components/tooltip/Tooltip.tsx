import "./tooltip.css";
import React from "react";

export default function Tooltip({
  children,
  label,
  wrap,
  beforeTop,
  afterTop,
}: {
  children: React.ReactNode;
  label: string;
  wrap: boolean;
  beforeTop: number;
  afterTop: number;
}) {
  return (
    <div
      className={`tooltip ${wrap ? "tooltip--wrap" : ""}`}
      data-tooltip={label}
      style={
        {
          "--tooltip-before-top": `${beforeTop}px`,
          "--tooltip-after-top": `${afterTop}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
