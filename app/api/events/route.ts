import { NextResponse } from "next/server";
import { BandsintownEvent } from "../../../types";

const BANDSINTOWN_API_URL = "https://rest.bandsintown.com";

export async function GET() {
  const appId = process.env.BANDSINTOWN_APP_ID;
  const artist = process.env.BANDSINTOWN_ARTIST;

  if (!appId || !artist) {
    return NextResponse.json(
      {
        error: "Bandsintown configuration is missing.",
      },
      {
        status: 500,
      },
    );
  }

  const artistIdentifier = encodeURIComponent(artist);

  const url = `${BANDSINTOWN_API_URL}/artists/` + `${artistIdentifier}/events` + `?app_id=${encodeURIComponent(appId)}` + `&date=upcoming`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (response.status === 404) {
      return NextResponse.json({
        events: [],
        artistFound: false,
      });
    }

    if (!response.ok) {
      const message = await response.text();

      throw new Error(`Bandsintown request failed: ${response.status} ${message}`);
    }

    const events = (await response.json()) as BandsintownEvent[];

    const now = new Date();

    const upcomingEvents = events
      .filter((event) => {
        if (event.sold_out) {
          return false; // optional
        }

        const eventEnd = event.ends_at ? new Date(event.ends_at) : new Date(event.datetime);

        return eventEnd >= now;
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

    return NextResponse.json({
      events: upcomingEvents,
      artistFound: true,
    });
  } catch (error) {
    console.error("Bandsintown API error:", error);

    return NextResponse.json(
      {
        error: "Concert dates could not be loaded.",
      },
      {
        status: 500,
      },
    );
  }
}
