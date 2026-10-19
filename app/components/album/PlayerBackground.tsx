"use client";

import { motion } from "framer-motion";

interface PlayerBackgroundProps {
  isPlaying: boolean;
}

export default function PlayerBackground({ isPlaying }: PlayerBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Main golden glow */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
          opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3,
        }}
        transition={{
          duration: 7,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 550,
          aspectRatio: "1",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,181,46,0.35) 0%, rgba(245,181,46,0.08) 45%, transparent 75%)",
          filter: "blur(55px)",
        }}
      />

      {/* Neon green ambient light */}
      <motion.div
        animate={{
          opacity: isPlaying ? [0.08, 0.22, 0.08] : 0.05,
        }}
        transition={{
          duration: 9,
          repeat: isPlaying ? Infinity : 0,
        }}
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-30%",
          width: "90vw",
          maxWidth: 450,
          aspectRatio: "1",
          borderRadius: "50%",
          background: "#B6FF00",
          filter: "blur(130px)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, index) => {
        const x = (index * 37) % 100;
        const y = (index * 61) % 100;

        return (
          <motion.span
            key={index}
            animate={{
              y: isPlaying ? [0, -25, 0] : 0,
              opacity: isPlaying ? [0.1, 0.6, 0.1] : 0.1,
            }}
            transition={{
              duration: 4 + (index % 5),
              repeat: isPlaying ? Infinity : 0,
              delay: index * 0.3,
            }}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: index % 3 === 0 ? 3 : 2,
              height: index % 3 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: "#F5B52E",
              boxShadow: "0 0 12px rgba(245,181,46,0.8)",
            }}
          />
        );
      })}
    </div>
  );
}
