"use client";

import { Box, Button, Container, Flex, Heading, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaArrowRight, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./StatementSection";
import { BandsintownEvent, EventsResponse } from "../../types";

export function TourDates() {
  const [events, setEvents] = useState<BandsintownEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      try {
        const response = await fetch("/api/events", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Events request failed: ${response.status}`);
        }

        const data = (await response.json()) as EventsResponse;

        setEvents(data.events);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();

    return () => controller.abort();
  }, []);

  return (
    <Box id="tour" position="relative" overflow="hidden" bg="#080a08" py={{ base: 20, md: 28 }} scrollMarginTop="90px">
      <Box
        position="absolute"
        top="-200px"
        right="-140px"
        w="560px"
        h="560px"
        borderRadius="full"
        bg="rgba(217,255,67,0.06)"
        filter="blur(120px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Reveal distance={28}>
          <Stack mb={{ base: 10, md: 14 }} spacing={5} maxW="760px">
            <SectionLabel>Live</SectionLabel>

            <Heading
              as="h2"
              fontSize={{
                base: "4xl",
                md: "6xl",
              }}
              fontWeight={500}
              letterSpacing="-0.045em"
            >
              Upcoming shows.
              <Text as="span" color="#d9ff43">
                {" "}
                See Cali P live.
              </Text>
            </Heading>

            <Text color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.8}>
              Tour dates and ticket information, updated automatically through Bandsintown.
            </Text>
          </Stack>
        </Reveal>

        {isLoading && <TourSkeleton />}

        {!isLoading && hasError && <EmptyState title="Tour dates could not be loaded" text="Please check again later." />}

        {!isLoading && !hasError && events.length === 0 && (
          <EmptyState title="No upcoming shows announced" text="New tour dates will appear here automatically." />
        )}

        {!isLoading && !hasError && events.length > 0 && (
          <Stack spacing={4}>
            {events.map((event, index) => (
              <Reveal key={event.id} delay={Math.min(index * 0.06, 0.3)} distance={18}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

function EventCard({ event }: { event: BandsintownEvent }) {
  const eventDate = new Date(event.datetime);

  const fullDate = formatEventDate(event);

  const location = [event.venue.city, event.venue.region, event.venue.country].filter(Boolean).join(", ");

  const countryFlag = getCountryFlag(event.venue.country);

  const day = new Intl.DateTimeFormat("en", {
    day: "2-digit",
  }).format(eventDate);

  const month = new Intl.DateTimeFormat("en", {
    month: "short",
  })
    .format(eventDate)
    .toUpperCase();

  const year = new Intl.DateTimeFormat("en", {
    year: "numeric",
  }).format(eventDate);

  const ticketOffer = event.offers.find((offer) => offer.status === "available" && offer.url);

  const eventUrl = ticketOffer?.url ?? event.url;

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "stretch", md: "center" }}
      gap={{ base: 6, md: 8 }}
      p={{ base: 6, md: 7 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius={{ base: "24px", md: "30px" }}
      bg="rgba(255,255,255,0.035)"
      backdropFilter="blur(14px)"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "rgba(217,255,67,0.55)",
        transform: "translateY(-4px)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
      }}
    >
      <Flex
        flexShrink={0}
        align="center"
        justify="center"
        direction="column"
        w={{ base: "full", md: "110px" }}
        minH={{ base: "90px", md: "110px" }}
        borderRadius="20px"
        bg="#d9ff43"
        color="#080a08"
      >
        <Text fontSize="4xl" fontWeight={900} lineHeight={1}>
          {day}
        </Text>

        <Text fontSize="sm" fontWeight={900} letterSpacing="0.14em">
          {month}
        </Text>

        <Text mt={1} fontSize="xs" fontWeight={700} opacity={0.65}>
          {year}
        </Text>
      </Flex>

      <Stack flex={1} spacing={3}>
        <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight={600}>
          {event.title || event.venue.name}
        </Heading>

        {event.title && (
          <Text color="whiteAlpha.700" fontWeight={600}>
            {event.venue.name}
          </Text>
        )}

        <HStack align="flex-start" color="whiteAlpha.500" fontSize="sm">
          <Box mt="3px">
            <FaCalendarAlt />
          </Box>

          <Text>{fullDate}</Text>
        </HStack>

        <HStack align="flex-start" color="whiteAlpha.500" fontSize="sm">
          <Box mt="3px">
            <FaMapMarkerAlt />
          </Box>

          <Text>
            {countryFlag} {location}
          </Text>
        </HStack>
      </Stack>

      <Button
        as="a"
        href={eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={ticketOffer ? <FaTicketAlt /> : <FaArrowRight />}
        w={{ base: "full", md: "auto" }}
        h="52px"
        flexShrink={0}
        borderRadius="full"
        bg={ticketOffer ? "#d9ff43" : "whiteAlpha.100"}
        color={ticketOffer ? "#080a08" : "white"}
        px={7}
        fontSize="sm"
        fontWeight={800}
        textTransform="uppercase"
        letterSpacing="0.08em"
        _hover={{
          bg: ticketOffer ? "#ecff9b" : "whiteAlpha.200",
          transform: "translateY(-2px)",
        }}
      >
        {ticketOffer ? "Tickets" : "Event details"}
      </Button>
    </Flex>
  );
}
function TourSkeleton() {
  return (
    <Stack spacing={4}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} h={{ base: "260px", md: "165px" }} borderRadius="30px" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
      ))}
    </Stack>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Stack
      spacing={4}
      align="center"
      p={{ base: 9, md: 14 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="30px"
      bg="whiteAlpha.50"
      textAlign="center"
    >
      <FaCalendarAlt size={34} />

      <Heading size="md">{title}</Heading>

      <Text color="whiteAlpha.500">{text}</Text>
    </Stack>
  );
}

function formatEventDate(event: BandsintownEvent): string {
  const locale = "en-GB";

  if (event.datetime_display_rule === "range" && event.festival_start_date && event.festival_end_date) {
    const start = new Date(`${event.festival_start_date}T12:00:00`);
    const end = new Date(`${event.festival_end_date}T12:00:00`);

    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

    const sameYear = start.getFullYear() === end.getFullYear();

    if (sameMonth) {
      return `${new Intl.DateTimeFormat(locale, {
        day: "numeric",
      }).format(start)}–${new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(end)}`;
    }

    if (sameYear) {
      return `${new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
      }).format(start)} – ${new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(end)}`;
    }

    return `${new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(start)} – ${new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(end)}`;
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(event.datetime));
}

function getCountryFlag(country: string): string {
  const countryCodes: Record<string, string> = {
    Switzerland: "CH",
    Germany: "DE",
    Austria: "AT",
    France: "FR",
    Italy: "IT",
    Netherlands: "NL",
    Belgium: "BE",
    Spain: "ES",
    Portugal: "PT",
    "United Kingdom": "GB",
    USA: "US",
    "United States": "US",
  };

  const code = countryCodes[country];

  if (!code) return "🌍";

  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
  );
}
