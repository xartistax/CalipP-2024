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
    title: "Cali P Music",
    description: "Discover the latest releases, albums and singles from reggae artist Cali P.",
    url: "/music",
    type: "website",
  },
};

export default function MusicPage() {
  return (
    <SubpageShell>
      <MusicSection />
    </SubpageShell>
  );
}
