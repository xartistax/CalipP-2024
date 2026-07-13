"use client";

import { Box, Button, Container, FormControl, FormErrorMessage, Input, Stack, Text, Heading, Flex } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { trackEvent } from "../../lib/analytics";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const isInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || isInvalid) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed.");
      }

      trackEvent("newsletter_signup", {
        location: "newsletter_section",
      });

      setStatus("success");
      setMessage(data.message || "You are subscribed.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed. Please try again.");
    }
  }

  return (
    <Box as="section" bg="#080a08" px={{ base: 5, md: 8 }} py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Stack
          position="relative"
          overflow="hidden"
          spacing={8}
          align="center"
          px={{ base: 6, md: 14 }}
          py={{ base: 12, md: 16 }}
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius={{ base: "28px", md: "44px" }}
          bg="rgba(255,255,255,0.035)"
          textAlign="center"
        >
          <Box
            position="absolute"
            top="-180px"
            left="50%"
            w="500px"
            h="500px"
            borderRadius="full"
            bg="rgba(217,255,67,0.08)"
            filter="blur(120px)"
            transform="translateX(-50%)"
            pointerEvents="none"
          />

          <Stack position="relative" spacing={5} align="center">
            <Text color="#d9ff43" fontSize="xs" fontWeight={800} letterSpacing="0.18em" textTransform="uppercase">
              Newsletter
            </Text>

            <Heading as="h2" maxW="760px" fontSize={{ base: "3xl", md: "5xl" }} fontWeight={500} letterSpacing="-0.04em">
              Never miss a release.
            </Heading>

            <Text maxW="620px" color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.8}>
              Get updates about new music, tour dates and exclusive releases.
            </Text>
          </Stack>

          <Box as="form" position="relative" w="full" maxW="680px" onSubmit={handleSubmit}>
            <FormControl isInvalid={status === "error"}>
              <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setStatus("idle");
                    setMessage("");
                  }}
                  placeholder="Your email address"
                  autoComplete="email"
                  required
                  h="58px"
                  px={6}
                  borderRadius="full"
                  borderColor="whiteAlpha.300"
                  bg="blackAlpha.300"
                  color="white"
                  _placeholder={{
                    color: "whiteAlpha.400",
                  }}
                  _focusVisible={{
                    borderColor: "#d9ff43",
                    boxShadow: "0 0 0 1px #d9ff43",
                  }}
                />

                <Button
                  type="submit"
                  h="58px"
                  px={9}
                  flexShrink={0}
                  borderRadius="full"
                  bg="#d9ff43"
                  color="#080a08"
                  fontWeight={900}
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  isLoading={status === "loading"}
                  loadingText="Joining"
                  onClick={() =>
                    trackEvent("newsletter_click", {
                      location: "newsletter_section",
                    })
                  }
                  onSubmit={() => {
                    trackEvent("newsletter_signup", {
                      location: "newsletter_section",
                    });
                  }}
                  _hover={{
                    bg: "#ecff9b",
                    transform: "translateY(-2px)",
                  }}
                >
                  Subscribe
                </Button>
              </Stack>

              {status === "error" && <FormErrorMessage justifyContent="center">{message}</FormErrorMessage>}
            </FormControl>

            {status === "success" && (
              <Stack mt={6} spacing={3} align="center" role="status" aria-live="polite" animation="newsletterSuccess 0.5s ease both">
                <Flex align="center" justify="center" w="54px" h="54px" borderRadius="full" bg="#d9ff43" color="#080a08" fontSize="2xl" fontWeight={900}>
                  ✓
                </Flex>

                <Heading as="h3" fontSize="xl" fontWeight={600}>
                  Thanks for subscribing!
                </Heading>

                <Text color="whiteAlpha.600" fontSize="sm">
                  {message}
                </Text>
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
