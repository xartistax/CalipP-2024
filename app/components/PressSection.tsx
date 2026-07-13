"use client";

import { Box, Button, Container, Grid, Heading, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaNewspaper } from "react-icons/fa";

import { Reveal } from "./Reveal";
import { SectionLabel } from "./StatementSection";
import { trackEvent } from "../../lib/analytics";

type PressArticle = {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  description: string;
  imageUrl: string | null;
  author: string | null;
};

type PressResponse = {
  articles: PressArticle[];
  count: number;
  totalResults?: number;
  error?: string;
};

export function PressSection() {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadArticles() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/press", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Press request failed: ${response.status}`);
        }

        const data = (await response.json()) as PressResponse;

        setArticles(Array.isArray(data.articles) ? data.articles : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Press frontend error:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();

    return () => controller.abort();
  }, []);

  return (
    <Box id="press" position="relative" overflow="hidden" bg="#080a08" py={{ base: 20, md: 28 }} scrollMarginTop="90px">
      <Box
        position="absolute"
        top="-180px"
        right="-160px"
        w="580px"
        h="580px"
        borderRadius="full"
        bg="rgba(217,255,67,0.055)"
        filter="blur(130px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Stack spacing={{ base: 10, md: 14 }}>
          <Reveal distance={28}>
            <Grid
              templateColumns={{
                base: "1fr",
                lg: "1fr 0.75fr",
              }}
              gap={{ base: 8, lg: 16 }}
              alignItems="end"
            >
              <Stack spacing={6}>
                <SectionLabel>Press</SectionLabel>

                <Heading
                  as="h2"
                  maxW="760px"
                  fontSize={{
                    base: "4xl",
                    md: "6xl",
                    lg: "7xl",
                  }}
                  lineHeight={0.98}
                  fontWeight={500}
                  letterSpacing="-0.05em"
                >
                  Cali P in the press.
                  <Text as="span" display="block" color="#d9ff43">
                    Interviews, stories and features.
                  </Text>
                </Heading>
              </Stack>

              <Text
                maxW="520px"
                color="whiteAlpha.600"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight={1.8}
                textAlign={{ base: "left", lg: "right" }}
                justifySelf={{ lg: "end" }}
              >
                Selected articles, interviews and media coverage featuring Cali P.
              </Text>
            </Grid>
          </Reveal>

          {isLoading && <PressSkeleton />}

          {!isLoading && hasError && <PressFallback title="Press articles could not be loaded" text="Please check again later." />}

          {!isLoading && !hasError && articles.length === 0 && (
            <PressFallback title="No press articles available" text="New articles will appear here automatically." />
          )}

          {!isLoading && !hasError && articles.length > 0 && (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              }}
              gap={6}
            >
              {articles.map((article, index) => (
                <Reveal key={article.id} delay={Math.min(index * 0.05, 0.3)} distance={20}>
                  <PressCard article={article} />
                </Reveal>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

function PressCard({ article }: { article: PressArticle }) {
  return (
    <Stack
      as="article"
      h="full"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="26px"
      bg="rgba(255,255,255,0.035)"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "rgba(217,255,67,0.55)",
        transform: "translateY(-6px)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
      }}
    >
      <PressImage src={article.imageUrl} title={article.title} />

      <Stack flex={1} spacing={5} p={{ base: 6, md: 7 }}>
        <HStack justify="space-between" align="flex-start" gap={4}>
          <HStack color="#d9ff43" fontSize="xs" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase">
            <FaNewspaper />
            <Text>{article.source}</Text>
          </HStack>

          <Text flexShrink={0} color="whiteAlpha.400" fontSize="xs">
            {formatPressDate(article.publishedAt)}
          </Text>
        </HStack>

        <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight={600} lineHeight={1.25} letterSpacing="-0.025em" noOfLines={3}>
          {article.title}
        </Heading>

        {article.description && (
          <Text color="whiteAlpha.600" fontSize="sm" lineHeight={1.75} noOfLines={4}>
            {article.description}
          </Text>
        )}

        {article.author && (
          <Text color="whiteAlpha.400" fontSize="xs">
            By {article.author}
          </Text>
        )}

        <Button
          as="a"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("press_click", {
              source: article.source,

              article_title: article.title,

              destination_url: article.url,
            })
          }
          mt="auto"
          alignSelf="flex-start"
          rightIcon={<FaExternalLinkAlt />}
          borderRadius="full"
          variant="outline"
          borderColor="whiteAlpha.300"
          color="white"
          fontSize="xs"
          fontWeight={800}
          letterSpacing="0.1em"
          textTransform="uppercase"
          _hover={{
            borderColor: "#d9ff43",
            bg: "#d9ff43",
            color: "#080a08",
          }}
        >
          Read article
        </Button>
      </Stack>
    </Stack>
  );
}

function PressSkeleton() {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(3, minmax(0, 1fr))",
      }}
      gap={6}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} h="440px" borderRadius="26px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
      ))}
    </Grid>
  );
}

function PressFallback({ title, text }: { title: string; text: string }) {
  return (
    <Stack
      spacing={5}
      align="center"
      p={{ base: 9, md: 14 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="30px"
      bg="whiteAlpha.50"
      textAlign="center"
    >
      <FaNewspaper size={36} />

      <Heading size="md">{title}</Heading>

      <Text color="whiteAlpha.500">{text}</Text>
    </Stack>
  );
}

function formatPressDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function PressImage({ src, title }: { src: string | null; title: string }) {
  const [imageSrc, setImageSrc] = useState(src || "/press-fallback.jpg");

  return (
    <Box
      as="img"
      src={imageSrc}
      alt={title}
      w="full"
      aspectRatio={16 / 9}
      objectFit="cover"
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (imageSrc !== "/caliCover.jpg") {
          setImageSrc("/caliCover.jpg");
        }
      }}
    />
  );
}
