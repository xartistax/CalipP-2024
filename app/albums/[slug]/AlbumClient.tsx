"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Track } from "../../components/album/TrackList";
import TrackList from "../../components/album/TrackList";
import { AudioProvider } from "../../components/album/AudioProvider";
import MiniPlayer from "../../components/album/MiniPlayer";
import AlbumBooklet from "../../components/album/AlbumBooklet";
import MediaSession from "../../components/album/MediaSession";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { trackEvent } from "../../../lib/analytics";

export default function AlbumPage() {
  const { slug } = useParams<{ slug: string }>();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slug !== "i-thoughts-10years") return;

    const controller = new AbortController();

    async function loadTracks() {
      try {
        const response = await fetch(`/api/albums/${slug}/tracks`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load tracks");
        }

        const data: Track[] = await response.json();

        setTracks(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(error);
        setError("Unable to load album tracks.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTracks();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (slug !== "i-thoughts-10years") return;

    trackEvent("album_view", {
      album: "i-thoughts-10years",
      campaign: "nfc_promo_2026",
    });
  }, [slug]);

  if (slug !== "i-thoughts-10years") {
    return <div>Album not found</div>;
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#F5B52E",
          display: "grid",
          placeItems: "center",
        }}
      >
        Loading album...
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          display: "grid",
          placeItems: "center",
        }}
      >
        {error}
      </main>
    );
  }

  return (
    <AudioProvider tracks={tracks}>
      <MediaSession />
      <main
        style={{
          minHeight: "100dvh",
          background: "#050505",
          color: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Back to account */}
        <Link
          href="/account"
          aria-label="Back to my account"
          style={{
            position: "absolute",
            top: "max(24px, env(safe-area-inset-top))",
            left: "clamp(20px, 5vw, 48px)",
            zIndex: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 0",
            color: "#F5B52E",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.5px",
            textDecoration: "none",
            transition: "opacity 0.2s ease",
          }}
        >
          <IoArrowBack size={17} />
          MY ACCOUNT
        </Link>
        {/* Background Glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(245,181,46,0.22), transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <section
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Edition */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              color: "#F5B52E",
              fontSize: "11px",
              letterSpacing: "4px",
              marginBottom: "30px",
            }}
          >
            10TH ANNIVERSARY · DELUXE EDITION
          </motion.span>

          {/* Album Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            style={{
              width: "100%",
              maxWidth: "420px",
              position: "relative",
              aspectRatio: "1 / 1",
              boxShadow: "0 30px 100px rgba(245,181,46,0.12)",
            }}
          >
            <Image
              src="/albums/i-thoughts-10years/front.jpg"
              alt="Cali P – iThoughts Deluxe"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 420px"
              style={{
                objectFit: "contain",
              }}
            />
          </motion.div>

          {/* Artist */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} style={{ marginTop: "40px" }}>
            <h1
              style={{
                fontSize: "clamp(32px, 8vw, 56px)",
                fontWeight: 800,
                margin: 0,
                letterSpacing: "-2px",
              }}
            >
              iThoughts
            </h1>

            <p
              style={{
                color: "#F5B52E",
                fontSize: "14px",
                letterSpacing: "5px",
                marginTop: "10px",
              }}
            >
              CALI P
            </p>
          </motion.div>

          {/* Explore Button */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => document.getElementById("tracklist")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              marginTop: "45px",
              padding: "16px 36px",
              borderRadius: "100px",
              border: "none",
              background: "#B6FF00",
              color: "#050505",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "2px",
              cursor: "pointer",
            }}
          >
            EXPLORE ALBUM ↓
          </motion.button>
        </section>

        <TrackList tracks={tracks} />
        <AlbumBooklet />
      </main>
      <MiniPlayer />
    </AudioProvider>
  );
}
