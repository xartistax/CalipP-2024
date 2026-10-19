"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";

type ActivationResponse = {
  success?: boolean;
  alreadyActivated?: boolean;
  slug?: string;
  error?: string;
};

export default function ActivatePage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();

  const code = params.code;

  const { data: session, isPending } = authClient.useSession();

  const [status, setStatus] = useState<"idle" | "activating" | "success" | "error">("idle");

  const [error, setError] = useState("");

  // Verhindert doppelte Aktivierungsanfragen.
  const started = useRef(false);

  useEffect(() => {
    if (isPending || !session || !code || started.current) {
      return;
    }

    started.current = true;

    async function activate() {
      setStatus("activating");

      try {
        const response = await fetch("/api/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const text = await response.text();

        console.log("API Status:", response.status);
        console.log("API Response:", text);

        let data: ActivationResponse;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`API returned HTML instead of JSON (HTTP ${response.status})`);
        }

        if (!response.ok || !data.success || !data.slug) {
          throw new Error(data.error || "Activation failed.");
        }

        setStatus("success");

        router.replace(`/albums/${data.slug}`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Activation failed.");

        setStatus("error");
      }
    }

    activate();
  }, [code, session, isPending, router]);

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

          <p style={descriptionStyle}>Sign in or create an account to activate your NFC album card.</p>

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

        {status === "activating" && (
          <>
            <h2>Activating your album...</h2>

            <p style={descriptionStyle}>Please wait while we unlock your music.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2>Album unlocked!</h2>

            <p style={descriptionStyle}>Redirecting to your music...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2>Activation failed</h2>

            <p style={{ color: "#ff6b6b", marginTop: "16px" }}>{error}</p>

            <button
              onClick={() => {
                started.current = false;
                setError("");
                setStatus("idle");

                // Erneute Aktivierung beim nächsten Render.
                router.refresh();
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

        {status === "idle" && <p style={descriptionStyle}>Preparing activation...</p>}
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
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
  marginBottom: "40px",
};

const descriptionStyle: React.CSSProperties = {
  color: "#999",
  lineHeight: 1.7,
  margin: "20px 0 30px",
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
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "transparent",
  color: "#F5B52E",
  border: "1px solid #F5B52E",
};
