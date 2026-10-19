"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

function RegisterForm() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const callbackURL = searchParams.get("callbackURL");

  const redirectTo = callbackURL?.startsWith("/activate/") && !callbackURL.startsWith("//") ? callbackURL : "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setError(error.message || "Registration failed.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#F5B52E",
            }}
          >
            CALI P
          </h1>

          <p style={{ color: "#999", marginTop: "12px" }}>Create your account to unlock your music.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" style={inputStyle} />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            style={inputStyle}
          />

          {error && <p style={{ color: "#ff6b6b", fontSize: "14px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#B6FF00",
              color: "#050505",
              border: "none",
              padding: "16px",
              borderRadius: "10px",
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating account..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#888",
          }}
        >
          Already have an account?{" "}
          <a href="/login" style={{ color: "#F5B52E" }}>
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px",
  background: "#151515",
  border: "1px solid #333",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
