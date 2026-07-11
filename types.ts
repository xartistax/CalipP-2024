export type SpotifyImage = {
  url: string;
  width: number | null;
  height: number | null;
};

export type SpotifyRelease = {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation";
  album_group: "album" | "single" | "compilation" | "appears_on";
  release_date: string;
  total_tracks: number;
  images: SpotifyImage[];
  uri: string;

  dominant_color?: string;

  external_urls: {
    spotify: string;
  };

  artists: Array<{
    id: string;
    name: string;
  }>;
};

export type SpotifyStats = {
  releases: number;
  albums: number;
  singles: number;
  tracks: number;
  latestRelease: string | null;
};

export type SpotifyReleasesResponse = {
  items: SpotifyRelease[];
};

export type SpotifyResponse = {
  items: SpotifyRelease[];
};
