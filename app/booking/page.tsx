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
    title: "Book Cali P",
    description: "Booking and management contacts for concerts, festivals and collaborations with Cali P.",
    url: "/booking",
    type: "website",
  },
};

export default function BookingPage() {
  return (
    <SubpageShell>
      <BookingSection />
    </SubpageShell>
  );
}
