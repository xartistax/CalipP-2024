"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { SHOP_URL, SPOTIFY_URL, TIKTOK_URL, YOUTUBE_URL } from "./CaliPWebsite";

import styles from "./Hero.module.css";
import { trackEvent } from "../../lib/analytics";

type HeroProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSrc?: string;
  posterSrc?: string;
  onNavigate: (id: string) => void;
};

export function Hero({ videoRef, videoSrc, posterSrc, onNavigate }: HeroProps) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const loadVideo = () => {
      setShouldLoadVideo(true);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(loadVideo, {
        timeout: 1800,
      });

      return () => window.cancelIdleCallback(idleId);
    }
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.media}>
        {posterSrc && (
          <Image src={posterSrc} alt="" fill priority fetchPriority="high" sizes="100vw" quality={72} aria-hidden="true" className={styles.poster} />
        )}

        {shouldLoadVideo && videoSrc && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => {
              setIsVideoReady(true);

              trackEvent("hero_video_loaded", {
                location: "hero",
              });
            }}
            className={[styles.video, isVideoReady ? styles.videoReady : ""].filter(Boolean).join(" ")}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>

      <div className={styles.baseOverlay} />
      <div className={styles.contentOverlay} />
      <div className={styles.bottomOverlay} />
      <div className={styles.vignette} />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>Reggae · Culture · Consciousness</span>
          </div>

          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Cali P"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 480px) 210px, (max-width: 768px) 280px, 470px"
              className={styles.logoImage}
            />
          </div>

          <h1 className={styles.heading}>
            Music with a message. <span>Energy with purpose.</span>
          </h1>

          <p className={styles.description}>Bridging cultures, elevating consciousness and inspiring change through music.</p>

          <div className={styles.actions}>
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() =>
                trackEvent("spotify_click", {
                  location: "hero",

                  destination_url: SPOTIFY_URL,
                })
              }
            >
              <SpotifyIcon />
              Listen on Spotify
            </a>

            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionButton} ${styles.secondaryButton}`}
              onClick={() =>
                trackEvent("store_click", {
                  location: "hero",

                  destination_url: SHOP_URL,
                })
              }
            >
              <ShopIcon />
              Visit store
            </a>
          </div>

          <div className={styles.socials} aria-label="Social media">
            <SocialLink label="Spotify" href={SPOTIFY_URL}>
              <SpotifyIcon />
            </SocialLink>

            <SocialLink label="YouTube" href={YOUTUBE_URL}>
              <YoutubeIcon />
            </SocialLink>

            <SocialLink label="TikTok" href={TIKTOK_URL}>
              <TiktokIcon />
            </SocialLink>

            <SocialLink label="Email" href="mailto:info@calipmusic.com">
              <EmailIcon />
            </SocialLink>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.exploreButton}
        onClick={() => {
          trackEvent("explore_click", {
            location: "hero",
            destination: "music",
          });

          onNavigate("music");
        }}
      >
        <ArrowDownIcon />
        Explore
      </button>
    </section>
  );
}

type SocialLinkProps = {
  label: string;
  href: string;
  children: React.ReactNode;
};

function SocialLink({ label, href, children }: SocialLinkProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={styles.socialLink}
      aria-label={label}
      onClick={() =>
        trackEvent("social_click", {
          platform: label.toLowerCase(),
          location: "hero",
          destination_url: href,
        })
      }
    >
      {children}
    </a>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.58 14.42a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.04 8.5-.59 11.66 1.34a.75.75 0 0 1 .25 1.03Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.16-2.55-11.97-1.4a.94.94 0 1 1-.54-1.8c4.37-1.32 9.8-.68 13.49 1.58a.94.94 0 0 1 .31 1.31Zm.13-3.41C14.31 7.44 7.92 7.23 4.22 8.35A1.13 1.13 0 1 1 3.57 6.2c4.25-1.29 11.33-1.04 15.77 1.59a1.13 1.13 0 0 1-1.16 1.95Z"
      />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M21.58 7.19a2.8 2.8 0 0 0-1.97-1.98C17.87 4.75 12 4.75 12 4.75s-5.87 0-7.61.46a2.8 2.8 0 0 0-1.97 1.98A29.1 29.1 0 0 0 2 12a29.1 29.1 0 0 0 .42 4.81 2.8 2.8 0 0 0 1.97 1.98c1.74.46 7.61.46 7.61.46s5.87 0 7.61-.46a2.8 2.8 0 0 0 1.97-1.98A29.1 29.1 0 0 0 22 12a29.1 29.1 0 0 0-.42-4.81ZM10 15.25v-6.5L15.5 12 10 15.25Z"
      />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M15.5 3c.35 2.05 1.56 3.27 3.5 3.4v3.12a8.2 8.2 0 0 1-3.47-.8v6.24a5.47 5.47 0 1 1-4.72-5.42v3.17a2.35 2.35 0 1 0 1.55 2.25V3h3.14Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
      <path d="M3 5h18v14H3V5Zm1 1 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M12 4v16m-6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
