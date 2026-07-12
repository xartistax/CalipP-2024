import type { Metadata } from "next";
import { SubpageShell } from "../SubpageShell";
import { YoutubeSection } from "../YoutubeSection";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch official Cali P music videos, visualizers and live performances from the official YouTube channel.",

  alternates: {
    canonical: "/videos",
  },

  openGraph: {
    title: "Cali P Videos",
    description: "Watch official music videos, visualizers and live performances by Cali P.",
    url: "/videos",
    type: "website",
  },
};

export default function VideosPage() {
  return (
    <SubpageShell>
      <YoutubeSection />
    </SubpageShell>
  );
}
