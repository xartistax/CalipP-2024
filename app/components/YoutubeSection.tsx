"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowRight, FaClock, FaEye, FaPlay, FaYoutube } from "react-icons/fa";
import type { YoutubeResponse, YoutubeVideo } from "../../types";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./StatementSection";
import { trackEvent } from "../../lib/analytics";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@calipmusic";

export function YoutubeSection() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const controller = new AbortController();

    async function loadVideos() {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch("/api/youtube", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`YouTube request failed: ${response.status}`);
        }

        const data = (await response.json()) as YoutubeResponse;

        setVideos(Array.isArray(data.videos) ? data.videos : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("YouTube frontend error:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadVideos();

    return () => controller.abort();
  }, []);

  const featuredVideo = videos[0];
  const additionalVideos = videos.slice(1, 4);

  function playVideo(
    video: YoutubeVideo,

    location: "featured" | "video_list",
  ) {
    setSelectedVideo(video);

    trackEvent("youtube_video_play", {
      location,

      video_id: video.id,

      video_title: video.title,
    });

    onOpen();
  }

  return (
    <Box id="videos" position="relative" overflow="hidden" bg="#0d100d" py={{ base: 20, md: 28 }} scrollMarginTop="90px">
      {/* Ambient glow */}
      <Box
        position="absolute"
        top="-220px"
        left="-160px"
        w="620px"
        h="620px"
        borderRadius="full"
        bg="rgba(255, 0, 0, 0.055)"
        filter="blur(130px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Stack spacing={{ base: 12, md: 16 }}>
          {/* Section header */}
          <Grid
            templateColumns={{
              base: "1fr",
              lg: "1fr 0.75fr",
            }}
            gap={{ base: 8, lg: 16 }}
            alignItems="end"
          >
            <Reveal distance={28}>
              <Stack spacing={6}>
                <SectionLabel>Latest videos</SectionLabel>

                <Heading
                  as="h2"
                  maxW="800px"
                  fontSize={{
                    base: "4xl",
                    md: "6xl",
                    lg: "7xl",
                  }}
                  lineHeight={0.98}
                  fontWeight={500}
                  letterSpacing="-0.05em"
                >
                  Watch the music.
                  <Text as="span" display="block" color="#d9ff43">
                    Feel the energy.
                  </Text>
                </Heading>
              </Stack>
            </Reveal>

            <Reveal delay={0.1} distance={22}>
              <Stack
                align={{
                  base: "flex-start",
                  lg: "flex-end",
                }}
                spacing={5}
              >
                <Text
                  maxW="540px"
                  color="whiteAlpha.600"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight={1.8}
                  textAlign={{
                    base: "left",
                    lg: "right",
                  }}
                >
                  Music videos, live performances and recent releases from the official Cali P YouTube channel.
                </Text>

                <Button
                  as="a"
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("youtube_click", {
                      location: "youtube section",

                      destination_url: YOUTUBE_CHANNEL_URL,
                    })
                  }
                  leftIcon={<FaYoutube />}
                  rightIcon={<FaArrowRight />}
                  borderRadius="full"
                  bg="#ff0033"
                  color="white"
                  px={7}
                  fontWeight={800}
                  _hover={{
                    bg: "#ff3157",
                    transform: "translateY(-2px)",
                  }}
                >
                  Visit YouTube
                </Button>
              </Stack>
            </Reveal>
          </Grid>

          {isLoading && <YoutubeSkeleton />}

          {!isLoading && hasError && <YoutubeFallback title="Videos could not be loaded" text="Visit the official YouTube channel to watch Cali P." />}

          {!isLoading && !hasError && videos.length === 0 && <YoutubeFallback title="No videos available" text="New videos will appear here automatically." />}

          {!isLoading && !hasError && featuredVideo && (
            <Grid
              templateColumns={{
                base: "1fr",
                lg: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
              }}
              gap={{ base: 6, lg: 8 }}
              alignItems="stretch"
            >
              <Reveal distance={26}>
                <FeaturedVideoCard video={featuredVideo} onPlay={() => playVideo(featuredVideo, "featured")} />
              </Reveal>

              <Stack spacing={2}>
                {additionalVideos.map((video, index) => (
                  <Reveal key={video.id} delay={0.08 + index * 0.07} distance={20}>
                    <SmallVideoCard video={video} onPlay={() => playVideo(video, "video_list")} />
                  </Reveal>
                ))}
              </Stack>
            </Grid>
          )}
        </Stack>
      </Container>
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isOpen}
        onClose={() => {
          onClose();

          setSelectedVideo(null);
        }}
      />
    </Box>
  );
}

function FeaturedVideoCard({
  video,

  onPlay,
}: {
  video: YoutubeVideo;

  onPlay: () => void;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onPlay}
      display="block"
      w="full"
      h="full"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius={{ base: "26px", md: "36px" }}
      bg="rgba(255,255,255,0.035)"
      color="white"
      overflow="hidden"
      textAlign="left"
      role="group"
      cursor="pointer"
      transition="all 0.35s ease"
      aria-label={`Play ${video.title}`}
      _hover={{
        borderColor: "rgba(217,255,67,0.55)",

        transform: "translateY(-6px)",

        boxShadow: "0 35px 100px rgba(0,0,0,0.4)",
      }}
      _focusVisible={{
        outline: "2px solid #d9ff43",

        outlineOffset: "4px",
      }}
    >
      <Box position="relative" aspectRatio={{ base: 16 / 10, md: 16 / 9 }} overflow="hidden" bg="black">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          priority
          sizes="(max-width: 992px) 100vw, 70vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.6s ease",
          }}
          className="youtube-thumbnail"
        />

        <Box position="absolute" inset={0} bgGradient="linear(to-t, rgba(0,0,0,0.82), transparent 65%)" />

        <Flex position="absolute" inset={0} align="center" justify="center">
          <Flex
            align="center"
            justify="center"
            w={{ base: "72px", md: "88px" }}
            h={{ base: "72px", md: "88px" }}
            borderRadius="full"
            bg="#d9ff43"
            color="#080a08"
            boxShadow="0 20px 55px rgba(0,0,0,0.4)"
            transform="scale(1)"
            transition="all 0.3s ease"
            _groupHover={{
              transform: "scale(1.12)",
              bg: "#ecff9b",
            }}
          >
            <FaPlay size={22} />
          </Flex>
        </Flex>

        <HStack
          position="absolute"
          right={4}
          bottom={4}
          px={3}
          py={1.5}
          borderRadius="full"
          bg="blackAlpha.700"
          color="white"
          fontSize="xs"
          fontWeight={700}
          backdropFilter="blur(8px)"
        >
          <FaClock />
          <Text>{formatYoutubeDuration(video.duration)}</Text>
        </HStack>
      </Box>

      <Stack spacing={4} p={{ base: 6, md: 8 }}>
        <HStack color="#ff3157" fontSize="xs" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase">
          <FaYoutube />
          <Text>Featured video</Text>
        </HStack>

        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight={500} lineHeight={1.12} letterSpacing="-0.035em" noOfLines={2}>
          {video.title}
        </Heading>

        <Text color="whiteAlpha.600" fontSize={{ base: "sm", md: "md" }} lineHeight={1.75} noOfLines={3}>
          {cleanDescription(video.description)}
        </Text>

        <HStack spacing={5} color="whiteAlpha.500" fontSize="sm">
          <HStack spacing={2}>
            <FaEye />
            <Text>{formatViews(video.views)} views</Text>
          </HStack>

          <Text>{formatPublishedDate(video.publishedAt)}</Text>
        </HStack>
      </Stack>
    </Box>
  );
}

function SmallVideoCard({ video, onPlay }: { video: YoutubeVideo; onPlay: () => void }) {
  return (
    <Grid
      as="button"
      type="button"
      onClick={onPlay}
      w="full"
      templateColumns={{
        base: "130px minmax(0, 1fr)",
        sm: "190px minmax(0, 1fr)",
        lg: "145px minmax(0, 1fr)",
      }}
      gap={4}
      alignItems="center"
      p={3}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="22px"
      bg="rgba(255,255,255,0.035)"
      color="white"
      textAlign="left"
      role="group"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "rgba(217,255,67,0.55)",
        transform: "translateY(-4px)",
        bg: "rgba(255,255,255,0.055)",
      }}
      _focusVisible={{
        outline: "2px solid #d9ff43",
        outlineOffset: "3px",
      }}
      aria-label={`Play ${video.title}`}
    >
      <Box position="relative" aspectRatio={16 / 9} overflow="hidden" borderRadius="15px" bg="black">
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes="190px"
          style={{
            objectFit: "cover",
            transition: "transform 0.45s ease",
          }}
          className="youtube-thumbnail"
        />

        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.15)" />

        <Flex position="absolute" inset={0} align="center" justify="center">
          <Flex
            align="center"
            justify="center"
            w="42px"
            h="42px"
            borderRadius="full"
            bg="rgba(217,255,67,0.92)"
            color="#080a08"
            transform="scale(0.92)"
            transition="transform 0.25s ease"
            _groupHover={{
              transform: "scale(1.08)",
            }}
          >
            <FaPlay size={12} />
          </Flex>
        </Flex>

        <Text position="absolute" right={2} bottom={2} px={2} py={0.5} borderRadius="md" bg="blackAlpha.800" color="white" fontSize="10px" fontWeight={700}>
          {formatYoutubeDuration(video.duration)}
        </Text>
      </Box>

      <Stack spacing={2} minW={0}>
        <Heading noOfLines={2} fontSize={{ base: "sm", sm: "md" }} fontWeight={700} lineHeight={1.3}>
          {video.title}
        </Heading>

        <HStack spacing={3} color="whiteAlpha.500" fontSize="xs">
          <HStack spacing={1.5}>
            <FaEye />
            <Text>{formatViews(video.views)}</Text>
          </HStack>

          <Text>{formatPublishedDate(video.publishedAt)}</Text>
        </HStack>
      </Stack>
    </Grid>
  );
}

function VideoPlayerModal({ video, isOpen, onClose }: { video: YoutubeVideo | null; isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered motionPreset="scale">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(12px)" />

      <ModalContent
        mx={{ base: 4, md: 8 }}
        overflow="hidden"
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius={{ base: "20px", md: "30px" }}
        bg="#080a08"
      >
        <ModalCloseButton
          zIndex={3}
          top={3}
          right={3}
          w="44px"
          h="44px"
          borderRadius="full"
          bg="blackAlpha.700"
          color="white"
          _hover={{
            bg: "#d9ff43",
            color: "#080a08",
          }}
        />

        <ModalBody p={0}>
          {video && (
            <Box position="relative" w="full" aspectRatio={16 / 9} bg="black">
              <Box
                as="iframe"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                position="absolute"
                inset={0}
                w="full"
                h="full"
                border={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
function YoutubeSkeleton() {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        lg: "1.35fr 0.65fr",
      }}
      gap={8}
    >
      <Skeleton minH={{ base: "420px", md: "620px" }} borderRadius="36px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />

      <Stack spacing={5}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} h="135px" borderRadius="22px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
        ))}
      </Stack>
    </Grid>
  );
}

function YoutubeFallback({ title, text }: { title: string; text: string }) {
  return (
    <Stack
      spacing={5}
      align="center"
      p={{ base: 9, md: 14 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="32px"
      bg="whiteAlpha.50"
      textAlign="center"
    >
      <FaYoutube size={44} />

      <Heading size="lg">{title}</Heading>

      <Text color="whiteAlpha.600">{text}</Text>

      <Button
        as="a"
        href={YOUTUBE_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={<FaYoutube />}
        borderRadius="full"
        bg="#ff0033"
        color="white"
        _hover={{
          bg: "#ff3157",
        }}
      >
        Open YouTube
      </Button>
    </Stack>
  );
}

function formatViews(value: string): string {
  const views = Number(value);

  if (!Number.isFinite(views)) {
    return "0";
  }

  return new Intl.NumberFormat("en", {
    notation: views >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(views);
}

function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatYoutubeDuration(duration: string): string {
  const match = duration.match(/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    return "0:00";
  }

  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function cleanDescription(description: string): string {
  const cleaned = description
    .replace(/https?:\/\/\S+/g, "")
    .replace(/#[A-Za-z0-9_-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "Watch the latest Cali P video on the official YouTube channel.";
}
