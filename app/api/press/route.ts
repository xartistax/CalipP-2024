import { NextResponse } from "next/server";

//export const revalidate = 60 * 60 * 24 * 30;
export const revalidate = 60 * 60 * 24 * 30;

type PerigonEntity = {
  data: string;
  type: string;
  mentions: number;
};

type PerigonSource = {
  domain: string;
};

type PerigonArticle = {
  url: string;
  articleId: string;
  clusterId?: string;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  pubDate: string;
  authorsByline?: string;
  source: PerigonSource;
  entities?: PerigonEntity[];
  translatedTitle?: string;
  translatedDescription?: string;
  translatedSummary?: string;
  shortSummary?: string;
  summary?: string;
  reprint?: boolean;
};

type PerigonResponse = {
  status: number;
  numResults: number;
  articles?: PerigonArticle[];
};

export type PressArticle = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  description: string;
  imageUrl: string | null;
  author: string | null;
};

const PERIGON_API_URL = "https://api.perigon.io/v1/all";

const SEARCH_QUERY = '"Cali P"';

const CACHE_SECONDS = 60 * 60 * 24 * 30;

const EXCLUDED_SOURCES = ["milano.repubblica.it"];

export async function GET() {
  const apiKey = process.env.PERIGON_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Perigon API key is missing.",
        articles: [],
      },
      {
        status: 500,
      },
    );
  }

  const params = new URLSearchParams({
    q: SEARCH_QUERY,
    size: "100",
    sortBy: "date",
    showReprints: "false",
    apiKey,
  });

  try {
    const response = await fetch(`${PERIGON_API_URL}?${params.toString()}`, {
      next: {
        revalidate: CACHE_SECONDS,
        tags: ["press-articles-v5"],
      },
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(`Perigon request failed: ${response.status} ${message}`);
    }

    const data = (await response.json()) as PerigonResponse;

    const rawArticles = Array.isArray(data.articles) ? data.articles : [];

    const mappedArticles = deduplicateArticles(rawArticles.filter(isRelevantArticle).map(mapArticle).filter(isWithinLastThreeYears)).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    const pinnedCypherArticle = rawArticles
      .filter(isSrfCypherArticle)
      .map(mapArticle)
      .filter(isWithinLastThreeYears)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];

    const limitedArticles = limitArticlesPerSource(mappedArticles, 2);

    const articles = ensurePinnedArticle(limitedArticles, pinnedCypherArticle, 2).slice(0, 12);

    return NextResponse.json({
      articles,
      count: articles.length,
      totalResults: data.numResults ?? 0,
    });
  } catch (error) {
    console.error("Perigon API error:", error);

    return NextResponse.json(
      {
        error: "Press articles could not be loaded.",
        articles: [],
      },
      {
        status: 500,
      },
    );
  }
}

function isRelevantArticle(article: PerigonArticle): boolean {
  const title = article.title ?? "";
  const description = article.description ?? "";
  const content = article.content ?? "";

  const source = article.source?.domain
    ?.toLowerCase()
    .replace(/^www\./, "")
    .trim();

  if (EXCLUDED_SOURCES.includes(source)) {
    return false;
  }

  const combinedText = `${title} ${description} ${content}`;

  // Offensichtliche Falschpositive ausschliessen
  const excludedTerms = /\b(cali-poke|cal-poke|cali poke|cal poke)\b/i;

  if (excludedTerms.test(combinedText)) {
    return false;
  }

  // Exaktes "Cali P", aber nicht "Cali-Poke"
  const caliPPattern = /(^|[^A-Za-z0-9])cali(?:\s+|-)p(?![A-Za-z0-9-])/i;

  const titleContainsCaliP = caliPPattern.test(title);
  const descriptionContainsCaliP = caliPPattern.test(description);

  const contentMentions = content.match(/(^|[^A-Za-z0-9])cali(?:\s+|-)p(?![A-Za-z0-9-])/gi)?.length ?? 0;

  const musicContext = /\b(reggae|dancehall|music|musician|artist|album|single|song|release|concert|festival|interview|sound system|singer)\b/i.test(
    combinedText,
  );

  return titleContainsCaliP || descriptionContainsCaliP || (contentMentions >= 2 && musicContext);
}

function mapArticle(article: PerigonArticle): PressArticle {
  return {
    id: article.articleId,
    title: article.translatedTitle?.trim() || article.title.trim(),

    source: article.source?.domain?.trim() || "Press",

    publishedAt: article.pubDate,

    url: article.url,

    description: getDescription(article),

    imageUrl: article.imageUrl ?? null,

    author: article.authorsByline?.trim() || null,
  };
}

function getDescription(article: PerigonArticle): string {
  const description = article.translatedSummary || article.shortSummary || article.summary || article.translatedDescription || article.description || "";

  return cleanText(description).slice(0, 320);
}

function cleanText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function deduplicateArticles(articles: PressArticle[]): PressArticle[] {
  const uniqueArticles = new Map<string, PressArticle>();

  for (const article of articles) {
    const key = article.title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();

    if (!uniqueArticles.has(key)) {
      uniqueArticles.set(key, article);
    }
  }

  return Array.from(uniqueArticles.values());
}

function isWithinLastThreeYears(article: PressArticle): boolean {
  const publishedAt = new Date(article.publishedAt);

  if (Number.isNaN(publishedAt.getTime())) {
    return false;
  }

  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 3);

  return publishedAt >= cutoffDate;
}

function limitArticlesPerSource(articles: PressArticle[], maximumPerSource: number): PressArticle[] {
  const sourceCounts = new Map<string, number>();

  return articles.filter((article) => {
    const source = normalizeSource(article.source);
    const currentCount = sourceCounts.get(source) ?? 0;

    if (currentCount >= maximumPerSource) {
      return false;
    }

    sourceCounts.set(source, currentCount + 1);

    return true;
  });
}

function isSrfCypherArticle(article: PerigonArticle): boolean {
  const source = article.source?.domain
    ?.toLowerCase()
    .replace(/^www\./, "")
    .trim();

  if (source !== "srf.ch" && !source.endsWith(".srf.ch")) {
    return false;
  }

  const text = [article.title, article.description, article.content].filter(Boolean).join(" ").toLowerCase();

  return text.includes("cypher") && /\bcali[\s-]+p\b/i.test(text);
}

function ensurePinnedArticle(articles: PressArticle[], pinnedArticle: PressArticle | undefined, maximumPerSource: number): PressArticle[] {
  if (!pinnedArticle) {
    return articles;
  }

  if (articles.some((article) => article.id === pinnedArticle.id)) {
    return articles;
  }

  const pinnedSource = normalizeSource(pinnedArticle.source);

  const sameSourceArticles = articles.filter((article) => normalizeSource(article.source) === pinnedSource);

  let result = [...articles];

  if (sameSourceArticles.length >= maximumPerSource) {
    const oldestSameSourceArticle = sameSourceArticles.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())[0];

    result = result.filter((article) => article.id !== oldestSameSourceArticle.id);
  }

  return [...result, pinnedArticle].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

function normalizeSource(source: string): string {
  return source
    .toLowerCase()
    .replace(/^www\./, "")
    .trim();
}
