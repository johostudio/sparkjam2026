"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

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
  const isInView = useInView(ref, { once: true, amount: 0.24 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.05,
      }}
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
    </motion.div>
  );
}
