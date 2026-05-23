"use client";

import { useRef } from "react";
import Image from "next/image";

interface SlideSectionProps {
  src: string;
  index: number;
  alt?: string;
  showDebug?: boolean;
}

export default function SlideSection({
  src,
  index,
  alt,
  showDebug = false,
}: SlideSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        padding: "2vh 0",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Image
          src={src}
          alt={alt || `Slide ${index + 1}`}
          fill
          sizes="60vw"
          style={{ objectFit: "contain" }}
          priority={index < 3}
        />
        {showDebug && (
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "10px",
              zIndex: 3,
              padding: "0.25rem 0.45rem",
              borderRadius: "8px",
              background: "rgba(0, 0, 0, 0.72)",
              color: "#fff",
              fontSize: "0.78rem",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            {index + 1}
          </div>
        )}
      </div>
    </div>
  );
}
