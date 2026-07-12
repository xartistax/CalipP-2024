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
export type BandsintownEvent = {
  id: string;
  artist_id: string;

  url: string;

  datetime: string;
  starts_at?: string;
  ends_at?: string;

  title?: string;
  description?: string;

  lineup: string[];

  free: boolean;
  sold_out: boolean;

  festival_start_date?: string;
  festival_end_date?: string;
  datetime_display_rule?: "datetime" | "range";

  venue: BandsintownVenue;

  offers: BandsintownOffer[];
};

export type BandsintownOffer = {
  type: string;
  url: string;
  status: string;
};

export type BandsintownVenue = {
  name: string;

  location: string;

  street_address?: string;
  postal_code?: string;

  city: string;
  region: string;
  country: string;

  latitude: string;
  longitude: string;
};

export type EventsResponse = {
  events: BandsintownEvent[];
  artistFound: boolean;
  error?: string;
};

export type YoutubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  views: string;
  duration: string;
};

export type YoutubeResponse = {
  videos: YoutubeVideo[];
};

export type NavigationProps = {
  isScrolled: boolean;
  onNavigate?: (id: string) => void;
};
