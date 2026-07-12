import type { Metadata } from "next";
import { ShopSection } from "../components/Shop";
import { SubpageShell } from "../components/SubpageShell";

export const metadata: Metadata = {
  title: "Official Store",
  description: "Discover official Cali P merchandise and exclusive products in the online store.",

  alternates: {
    canonical: "/shop",
  },

  openGraph: {
    title: "Cali P Official Store",
    description: "Discover official Cali P merchandise and exclusive products.",
    url: "/shop",
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <SubpageShell>
      <ShopSection />
    </SubpageShell>
  );
}
