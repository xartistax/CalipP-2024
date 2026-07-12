import type { Metadata } from "next";
import { SubpageShell } from "../components/SubpageShell";
import { PressSection } from "../components/PressSection";

export const metadata: Metadata = {
  title: "Press",
  description: "Read the latest press coverage, interviews, reviews and media features about Swiss reggae artist Cali P.",

  alternates: {
    canonical: "/press",
  },

  openGraph: {
    type: "website",
    url: "/press",
    title: "Cali P Press",
    description: "Latest press coverage, interviews and media features about reggae artist Cali P.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Cali P Press",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cali P Press",
    description: "Latest press coverage, interviews and media features about reggae artist Cali P.",
    images: ["/img_og.jpg"],
  },
};

export default function PressPage() {
  return (
    <SubpageShell>
      <h1 className="sr-only">Cali P Press – Interviews, Reviews and Media Coverage</h1>

      <PressSection />
    </SubpageShell>
  );
}
