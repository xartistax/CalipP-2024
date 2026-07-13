// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

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

  description: "Official website of reggae artist Cali P. Discover music, releases, videos, tour dates, merchandise and booking information.",

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
    description: "Official website of reggae artist Cali P. Discover music, releases, videos, tour dates, merchandise and booking information.",
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
    description: "Official website of reggae artist Cali P. Discover music, releases, videos, tour dates, merchandise and booking information.",
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

  category: "music",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080a08",
  colorScheme: "dark",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": `${siteUrl}/#artist`,
  name: "Cali P",
  url: siteUrl,
  image: `${siteUrl}/img_og.jpg`,
  description: "Cali P is a reggae artist combining conscious messages, international influences and modern reggae music.",
  genre: ["Reggae", "Dancehall", "Roots Reggae"],
  sameAs: [
    "https://open.spotify.com/artist/3ecsQBXTAjmQyO3Nqq0KZV",
    "https://www.youtube.com/@calipmusic",
    "https://www.tiktok.com/@itscalip",
    "https://www.instagram.com/calipmusic",
    "https://www.facebook.com/58577295467",
    "https://senmbelek-store.myshopify.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <GoogleAnalytics gaId="G-2NKR5JPWHQ" />
    </html>
  );
}
