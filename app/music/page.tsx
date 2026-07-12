import type { Metadata } from "next";
import { MusicSection } from "../components/Spotify";
import { SubpageShell } from "../components/SubpageShell";

export const metadata: Metadata = {
  title: "Music",
  description: "Discover Cali P's latest reggae releases, albums and singles. Listen directly through Spotify.",

  alternates: {
    canonical: "/music",
  },

  openGraph: {
    type: "website",
    url: "/music",
    title: "Cali P Music",
    description: "Discover the latest reggae releases, albums and singles from Cali P.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Cali P Music",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cali P Music",
    description: "Discover the latest reggae releases, albums and singles from Cali P.",
    images: ["/img_og.jpg"],
  },
};

export default function MusicPage() {
  return (
    <SubpageShell>
      <h1 className="sr-only">Cali P Music – Albums, Singles and Spotify Releases</h1>

      <MusicSection />
    </SubpageShell>
  );
}
