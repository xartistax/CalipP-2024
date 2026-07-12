import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cali P",
    short_name: "Cali P",
    description: "Official website of reggae artist Cali P. Discover music, videos, tour dates, merchandise and booking information.",

    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080a08",
    theme_color: "#080a08",

    categories: ["music", "entertainment"],

    lang: "en",

    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
