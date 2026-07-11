import { NextResponse } from "next/server";
import { SpotifyReleasesResponse } from "../../../types";
import sharp from "sharp";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";

type SpotifyTokenResponse = {
  access_token: string;
  expires_in: number;
};

async function getDominantColor(imageUrl?: string): Promise<string> {
  if (!imageUrl) {
    return "rgb(30, 215, 96)";
  }

  try {
    const response = await fetch(imageUrl, {
      next: {
        revalidate: 86400,
      },
    });

    if (!response.ok) {
      throw new Error("Cover could not be loaded.");
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    const { dominant } = await sharp(imageBuffer).stats();

    return `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;
  } catch (error) {
    console.error("Dominant color error:", error);

    return "rgb(30, 215, 96)";
  }
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are missing.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(`Spotify token request failed: ${response.status} ${message}`);
  }

  const data = (await response.json()) as SpotifyTokenResponse;

  return data.access_token;
}

export async function GET() {
  try {
    const artistId = process.env.SPOTIFY_ARTIST_ID;

    if (!artistId) {
      throw new Error("SPOTIFY_ARTIST_ID is missing.");
    }

    const token = await getAccessToken();

    const response = await fetch(`${API_URL}/artists/${artistId}/albums?include_groups=album,single&market=CH&limit=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(`Spotify releases request failed: ${response.status} ${message}`);
    }

    const releases = (await response.json()) as SpotifyReleasesResponse;

    const releasesWithColors = await Promise.all(
      releases.items.map(async (release) => ({
        ...release,

        dominant_color: await getDominantColor(release.images[0]?.url),
      })),
    );

    return NextResponse.json({
      ...releases,

      items: releasesWithColors,
    });
  } catch (error) {
    console.error("Spotify API error:", error);

    return NextResponse.json(
      {
        error: "Spotify releases could not be loaded.",
      },
      {
        status: 500,
      },
    );
  }
}
