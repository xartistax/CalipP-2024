"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SHOP_URL } from "./CaliPWebsite";
import styles from "./Navigation.module.css";

type NavigationProps = {
  isScrolled: boolean;
  onNavigate?: (id: string) => void;
};

const navigationItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "music", label: "Music", href: "/music" },
  { id: "tour", label: "Tour", href: "/tour" },
  { id: "videos", label: "Videos", href: "/videos" },
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "booking", label: "Booking", href: "/booking" },
] as const;

export function Navigation({ isScrolled, onNavigate }: NavigationProps) {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") {
      const currentItem = navigationItems.find((item) => item.href === pathname);

      setActiveSection(currentItem?.id ?? "home");
      return;
    }

    const sections = navigationItems.map((item) => document.getElementById(item.id)).filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (currentEntry) {
          setActiveSection(currentEntry.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.5],
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setIsMenuOpen(false);
    setActiveSection(id);

    if (pathname !== "/") {
      return;
    }

    event.preventDefault();

    if (id === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    onNavigate?.(id);
  };

  return (
    <>
      <header className={[styles.header, isScrolled || isMenuOpen ? styles.headerScrolled : ""].filter(Boolean).join(" ")}>
        <Link href="/" className={styles.logo} aria-label="Cali P homepage" onClick={(event) => handleNavigation(event, "home")}>
          <Image src="/logo.png" alt="Cali P" fill priority sizes="120px" className={styles.logoImage} />
        </Link>

        <nav className={styles.desktopNavigation} aria-label="Main navigation">
          {navigationItems
            .filter((item) => item.id !== "home")
            .map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={[styles.desktopLink, activeSection === item.id ? styles.activeLink : ""].filter(Boolean).join(" ")}
                aria-current={activeSection === item.id ? "page" : undefined}
                onClick={(event) => handleNavigation(event, item.id)}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className={styles.storeButton}>
          Store
          <ArrowIcon />
        </a>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      <nav
        id="mobile-navigation"
        className={[styles.mobileNavigation, isMenuOpen ? styles.mobileNavigationOpen : ""].filter(Boolean).join(" ")}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />

        <div className={styles.mobileLinks}>
          {navigationItems.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className={[styles.mobileLink, activeSection === item.id ? styles.mobileLinkActive : ""].filter(Boolean).join(" ")}
              style={{
                transitionDelay: isMenuOpen ? `${index * 60}ms` : "0ms",
              }}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={(event) => handleNavigation(event, item.id)}
            >
              <span>{item.label}</span>

              <span className={styles.mobileIndex}>{String(index + 1).padStart(2, "0")}</span>
            </Link>
          ))}
        </div>

        <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className={styles.mobileStoreButton}>
          <ShopIcon />
          Visit official store
          <ArrowIcon />
        </a>
      </nav>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
