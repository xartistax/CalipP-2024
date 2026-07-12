import type { Metadata } from "next";
import { ShopSection } from "../components/Shop";
import { SubpageShell } from "../components/SubpageShell";

export const metadata: Metadata = {
  title: "Official Store",
  description: "Discover official Cali P merchandise, apparel and exclusive products in the online store.",

  alternates: {
    canonical: "/shop",
  },

  openGraph: {
    type: "website",
    url: "/shop",
    title: "Cali P Official Store",
    description: "Shop official Cali P merchandise, apparel and exclusive products.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Cali P Official Store",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cali P Official Store",
    description: "Shop official Cali P merchandise, apparel and exclusive products.",
    images: ["/img_og.jpg"],
  },
};

export default function ShopPage() {
  return (
    <SubpageShell>
      <h1 className="sr-only">Cali P Official Store – Merchandise, Apparel and Exclusive Products</h1>

      <ShopSection />
    </SubpageShell>
  );
}
