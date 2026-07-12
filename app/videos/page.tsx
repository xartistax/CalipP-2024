import type { Metadata } from "next";
import { SubpageShell } from "../components/SubpageShell";
import VideosPage from "../components/videos/page";

export const metadata: Metadata = {
  title: "Tour Dates",
  description: "Discover upcoming Cali P concerts, festivals and live performances. Find dates, venues and ticket information.",

  alternates: {
    canonical: "/tour",
  },

  openGraph: {
    title: "Cali P Tour Dates",
    description: "Upcoming concerts, festivals and live performances by reggae artist Cali P.",
    url: "/tour",
    type: "website",
  },
};

export default function TourPage() {
  return (
    <SubpageShell>
      <VideosPage />
    </SubpageShell>
  );
}
