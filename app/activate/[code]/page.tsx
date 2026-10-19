"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";

type ActivationResponse = {
  success?: boolean;
  alreadyActivated?: boolean;
  alreadyOwned?: boolean;
  slug?: string;
  error?: string;
};

type ActivationStatus = "idle" | "activating" | "success" | "already-owned" | "error";

export default function ActivatePage() {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();

  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState<ActivationStatus>("idle");
  const [error, setError] = useState("");

  async function handleActivation() {
    if (!session || !code || status !== "idle") {
      return;
    }

    setStatus("activating");
    setError("");

    try {
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data: ActivationResponse = await response.json();

      if (!response.ok || !data.success || !data.slug) {
        throw new Error(data.error || "Activation failed.");
      }

      // User already owns the album.
      // The new NFC code has NOT been consumed.
      if (data.alreadyOwned) {
        setStatus("already-owned");
        return;
      }

      // Successful activation.
      setStatus("success");

      router.replace(`/albums/${data.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Activation failed.");

      setStatus("error");
    }
  }

  if (isPending) {
    return (
      <main style={pageStyle}>
        <p>Checking your account...</p>
      </main>
    );
  }

  if (!session) {
    const redirectTo = `/activate/${encodeURIComponent(code)}`;

    return (
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>CALI P</h1>

          <h2>Unlock your album</h2>

          <p style={descriptionStyle}>Sign in or create an account to activate your exclusive NFC album card.</p>

          <Link href={`/login?callbackURL=${encodeURIComponent(redirectTo)}`} style={buttonStyle}>
            SIGN IN
          </Link>

          <Link href={`/register?callbackURL=${encodeURIComponent(redirectTo)}`} style={secondaryButtonStyle}>
            CREATE ACCOUNT
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>CALI P</h1>

        {status === "idle" && (
          <>
            <p style={eyebrowStyle}>EXCLUSIVE DELUXE EDITION</p>

            <h2 style={titleStyle}>iThoughts</h2>

            <p style={descriptionStyle}>Activate your NFC album card to unlock your exclusive Cali P music experience.</p>

            <p style={accountStyle}>Signed in as {session.user.email}</p>

            <button type="button" onClick={handleActivation} style={buttonStyle}>
              ACTIVATE ALBUM
            </button>

            <Link href="/account" style={secondaryButtonStyle}>
              MY ACCOUNT
            </Link>
          </>
        )}

        {status === "activating" && (
          <>
            <h2 style={titleStyle}>Activating...</h2>

            <p style={descriptionStyle}>Please wait while we unlock your music.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 style={titleStyle}>Album unlocked!</h2>

            <p style={descriptionStyle}>Redirecting to your music...</p>
          </>
        )}

        {status === "already-owned" && (
          <>
            <p style={eyebrowStyle}>ALREADY UNLOCKED</p>

            <h2 style={titleStyle}>You already own this album</h2>

            <p style={descriptionStyle}>iThoughts is already part of your collection. This NFC activation code has not been used.</p>

            <Link href="/albums/i-thoughts-10years" style={buttonStyle}>
              GO TO MY ALBUM
            </Link>

            <Link href="/account" style={secondaryButtonStyle}>
              MY ACCOUNT
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={titleStyle}>Activation failed</h2>

            <p
              style={{
                ...descriptionStyle,
                color: "#ff6b6b",
              }}
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setError("");
                setStatus("idle");
              }}
              style={buttonStyle}
            >
              TRY AGAIN
            </button>

            <Link href="/account" style={secondaryButtonStyle}>
              MY ACCOUNT
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background: "#050505",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "440px",
  textAlign: "center",
};

const headingStyle: React.CSSProperties = {
  color: "#F5B52E",
  fontSize: "38px",
  fontWeight: 800,
  marginBottom: "36px",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#F5B52E",
  fontSize: "11px",
  letterSpacing: "3px",
  marginBottom: "14px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 800,
  margin: "0",
};

const descriptionStyle: React.CSSProperties = {
  color: "#999",
  lineHeight: 1.7,
  margin: "20px 0 30px",
};

const accountStyle: React.CSSProperties = {
  color: "#777",
  fontSize: "12px",
  marginBottom: "24px",
};

const buttonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "16px",
  background: "#B6FF00",
  color: "#050505",
  border: "none",
  borderRadius: "10px",
  fontWeight: 800,
  textDecoration: "none",
  cursor: "pointer",
  marginTop: "16px",
  fontSize: "13px",
  letterSpacing: "1px",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "transparent",
  color: "#F5B52E",
  border: "1px solid #F5B52E",
};
