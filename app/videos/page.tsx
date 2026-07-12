import type { Metadata } from "next";
import { SubpageShell } from "../components/SubpageShell";
import { YoutubeSection } from "../components/YoutubeSection";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch official Cali P music videos, visualizers and live performances from the official YouTube channel.",

  alternates: {
    canonical: "/videos",
  },

  openGraph: {
    type: "website",
    url: "/videos",
    title: "Cali P Videos",
    description: "Watch official music videos, visualizers and live performances by Cali P.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Cali P Videos",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cali P Videos",
    description: "Watch official music videos, visualizers and live performances by Cali P.",
    images: ["/img_og.jpg"],
  },
};

export default function VideosPage() {
  return (
    <SubpageShell>
      <h1 className="sr-only">Cali P Videos – Official Music Videos, Live Performances and YouTube Releases</h1>

      <YoutubeSection />
    </SubpageShell>
  );
}
