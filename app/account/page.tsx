import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { sql } from "../../lib/db";
import { auth } from "../../lib/auth";
import LogoutButton from "../components/auth/LogoutButton";

export const dynamic = "force-dynamic";

type UserAlbum = {
  slug: string;
  title: string;
  artist: string;
  cover_url: string | null;
};

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const albums = (await sql`
    SELECT
      a.slug,
      a.title,
      a.artist,
      a.cover_url
    FROM user_albums ua
    JOIN albums a ON a.id = ua.album_id
    WHERE ua.user_id = ${session.user.id}
    ORDER BY ua.activated_at DESC
  `) as UserAlbum[];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "60px 24px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "60px",
          }}
        >
          <h1 style={{ color: "#F5B52E", fontSize: "28px" }}>CALI P</h1>

          <LogoutButton />
        </header>

        <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>Welcome, {session.user.name}</h2>

        <p style={{ color: "#999", marginBottom: "50px" }}>Your music collection</p>

        {albums.length === 0 ? (
          <div
            style={{
              border: "1px solid #333",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "22px", marginBottom: "12px" }}>No albums unlocked yet</h3>

            <p style={{ color: "#999" }}>Scan your Cali P NFC card to unlock your album.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {albums.map((album) => (
              <Link
                key={album.slug}
                href={`/albums/${album.slug}`}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                {album.cover_url && (
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                )}

                <h3 style={{ marginTop: "14px" }}>{album.title}</h3>

                <p style={{ color: "#999" }}>{album.artist}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
