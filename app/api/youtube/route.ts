import { NextResponse } from "next/server";

const API = "https://www.googleapis.com/youtube/v3";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json(
      {
        error: "YouTube configuration is missing.",
      },
      {
        status: 500,
      },
    );
  }

  try {
    // Channel (Uploads + Statistics)
    const channelResponse = await fetch(`${API}/channels?part=contentDetails,statistics&id=${channelId}&key=${apiKey}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!channelResponse.ok) {
      throw new Error("Could not load channel.");
    }

    const channelData = await channelResponse.json();

    const channel = channelData.items?.[0];

    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Uploads playlist not found.");
    }

    // Latest videos
    const playlistResponse = await fetch(`${API}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=4&key=${apiKey}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!playlistResponse.ok) {
      throw new Error("Could not load playlist.");
    }

    const playlistData = await playlistResponse.json();

    const videoIds = playlistData.items.map((item: { contentDetails: { videoId: string } }) => item.contentDetails.videoId).join(",");

    // Video details
    const videosResponse = await fetch(`${API}/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!videosResponse.ok) {
      throw new Error("Could not load video details.");
    }

    const videosData = await videosResponse.json();

    type VideoStats = {
      views: string;
      duration: string;
    };

    type YouTubeVideoDetails = {
      id: string;
      statistics?: {
        viewCount?: string;
      };
      contentDetails?: {
        duration?: string;
      };
    };

    const videoDetails = videosData.items as YouTubeVideoDetails[];

    const statisticsMap = new Map<string, VideoStats>(
      videoDetails.map((video) => [
        video.id,
        {
          views: video.statistics?.viewCount ?? "0",
          duration: video.contentDetails?.duration ?? "",
        },
      ]),
    );

    const videos = playlistData.items.map(
      (item: {
        snippet: {
          title: string;
          description: string;
          publishedAt: string;
          thumbnails: {
            high?: {
              url: string;
            };
            medium?: {
              url: string;
            };
          };
        };
        contentDetails: {
          videoId: string;
        };
      }) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url,
        url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        views: statisticsMap.get(item.contentDetails.videoId)?.views ?? "0",
        duration: statisticsMap.get(item.contentDetails.videoId)?.duration ?? "",
      }),
    );

    return NextResponse.json({
      videos,

      stats: {
        videoCount: Number(channel.statistics?.videoCount ?? 0),
        viewCount: Number(channel.statistics?.viewCount ?? 0),
        subscriberCount: Number(channel.statistics?.subscriberCount ?? 0),
      },
    });
  } catch (error) {
    console.error("YouTube API:", error);

    return NextResponse.json(
      {
        error: "Could not load YouTube videos.",
      },
      {
        status: 500,
      },
    );
  }
}
