// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.calipmusic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Cali P | Official Website",
    template: "%s | Cali P",
  },

  description: "Official website of reggae artist Cali P. Discover music, releases, videos, merchandise and booking information.",

  keywords: ["Cali P", "Cali P music", "Cali P reggae", "reggae artist", "reggae music", "Swiss reggae artist", "Cali P official website"],

  authors: [
    {
      name: "Cali P",
      url: siteUrl,
    },
  ],

  creator: "Cali P",
  publisher: "Cali P",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Cali P",
    title: "Cali P | Official Website",
    description: "Official website of reggae artist Cali P. Discover music, releases, videos, merchandise and booking information.",
    images: [
      {
        url: "/img_og.jpg",
        width: 1200,
        height: 630,
        alt: "Cali P – Official Website",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cali P | Official Website",
    description: "Official website of reggae artist Cali P. Discover music, releases, videos, merchandise and booking information.",
    images: ["/img_og.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  category: "music",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080a08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Cali P",
    url: siteUrl,
    image: `${siteUrl}/img_og.jpg`,
    genre: ["Reggae", "Dancehall", "Roots Reggae"],
    sameAs: [
      "https://open.spotify.com/artist/3ecsQBXTAjmQyO3Nqq0KZV",
      "https://www.youtube.com/calipmusic",
      "https://www.tiktok.com/@itscalip",
      "https://senmbelek-store.myshopify.com/",
    ],
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
