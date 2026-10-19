"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AlbumBooklet() {
  const [flipped, setFlipped] = useState(false);

  return (
    <section
      style={{
        padding: "80px 20px 120px",
        background: "#080808",
        textAlign: "center",
      }}
    >
      <span
        style={{
          color: "#F5B52E",
          fontSize: 11,
          letterSpacing: 4,
        }}
      >
        THE DELUXE EXPERIENCE
      </span>

      <h2
        style={{
          color: "#fff",
          fontSize: "clamp(30px, 7vw, 48px)",
          margin: "15px 0 12px",
          fontWeight: 800,
        }}
      >
        THE BOOKLET<span style={{ color: "#B6FF00" }}>.</span>
      </h2>

      <p
        style={{
          color: "#999",
          fontSize: 14,
          marginBottom: 45,
        }}
      >
        Tap the artwork to explore the album
      </p>

      <div
        style={{
          perspective: "1200px",
          width: "100%",
          maxWidth: 420,
          aspectRatio: "1",
          margin: "0 auto",
        }}
      >
        <motion.button
          type="button"
          onClick={() => setFlipped(!flipped)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
          }}
          aria-label={flipped ? "Show front cover" : "Show back cover"}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            cursor: "pointer",
            background: "transparent",
            border: 0,
            padding: 0,
          }}
        >
          {/* Front */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 70px rgba(245,181,46,0.15)",
            }}
          >
            <Image
              src="/albums/i-thoughts-10years/front.jpg"
              alt="iThoughts Deluxe Front Cover"
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Back */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 70px rgba(245,181,46,0.15)",
            }}
          >
            <Image
              src="/albums/i-thoughts-10years/back.jpg"
              alt="iThoughts Deluxe Back Cover"
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </motion.button>
      </div>

      <p
        style={{
          marginTop: 30,
          color: "#B6FF00",
          fontSize: 11,
          letterSpacing: 3,
        }}
      >
        {flipped ? "← TAP TO SEE FRONT" : "TAP TO FLIP →"}
      </p>
    </section>
  );
}
