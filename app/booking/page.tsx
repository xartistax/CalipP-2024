import type { Metadata } from "next";
import { BookingSection } from "../components/Booking";
import { SubpageShell } from "../components/SubpageShell";

export const metadata: Metadata = {
  title: "Booking and Management",

  description: "Contact Cali P's booking agency and management team for concerts, festivals, collaborations and professional enquiries.",

  alternates: {
    canonical: "/booking",
  },

  openGraph: {
    type: "website",
    url: "/booking",
    title: "Book Cali P",
    description: "Booking and management contacts for concerts, festivals and collaborations with reggae artist Cali P.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Book Cali P",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Book Cali P",
    description: "Booking and management contacts for concerts, festivals and collaborations with Cali P.",
    images: ["/img_og.jpg"],
  },
};

export default function BookingPage() {
  return (
    <SubpageShell>
      <h1 className="sr-only">Book Cali P – Booking Agency, Management and Contact Information</h1>

      <BookingSection />
    </SubpageShell>
  );
}
