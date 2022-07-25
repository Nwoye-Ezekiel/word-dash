import React from "react";

interface SpacerProps {
  width?: number;
  height?: number;
}

export default function Spacer({ width, height }: SpacerProps) {
  return (
    <div
      style={{
        display: `${width ? "inline-block" : "block"}`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
