import type { Metadata } from "next";
import { SubpageShell } from "../components/SubpageShell";
import { TourDates } from "../components/TourDates";

export const metadata: Metadata = {
  title: "Tour Dates",
  description: "Discover upcoming Cali P concerts, festivals and live performances. Find dates, venues and ticket information.",

  alternates: {
    canonical: "/tour",
  },

  openGraph: {
    type: "website",
    url: "/tour",
    title: "Cali P Tour Dates",
    description: "Upcoming concerts, festivals and live performances by reggae artist Cali P.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Cali P Tour Dates",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cali P Tour Dates",
    description: "Upcoming concerts, festivals and live performances by reggae artist Cali P.",
    images: ["/img_og.jpg"],
  },
};

export default function TourPage() {
  return (
    <SubpageShell>
      <h1 className="sr-only">Cali P Tour Dates – Concerts, Festivals and Live Performances</h1>

      <TourDates />
    </SubpageShell>
  );
}
