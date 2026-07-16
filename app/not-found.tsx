"use client";
import Link from "next/link";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuote(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Box minH="100vh" display="flex" alignItems="center" bg="#080a08" overflow="hidden" position="relative">
      <Box
        position="absolute"
        top="-220px"
        left="50%"
        transform="translateX(-50%)"
        w="700px"
        h="700px"
        borderRadius="full"
        bg="rgba(217,255,67,.08)"
        filter="blur(140px)"
      />

      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontSize={{
          base: "170px",
          md: "360px",
        }}
        fontWeight={900}
        letterSpacing="-0.08em"
        color="whiteAlpha.50"
        lineHeight={0.8}
        userSelect="none"
      >
        404
      </Text>

      <Container maxW="6xl" position="relative" zIndex={2}>
        <Stack spacing={8} align="center" textAlign="center">
          <Text color="#d9ff43" fontSize="xs" fontWeight={800} letterSpacing="0.22em" textTransform="uppercase">
            Error 404
          </Text>

          <Heading
            color="white"
            maxW="900px"
            fontSize={{
              base: "5xl",
              md: "7xl",
            }}
            lineHeight={0.95}
            fontWeight={500}
            letterSpacing="-0.05em"
          >
            This page
            <Text as="span" display="block" color="#d9ff43">
              has left the stage.
            </Text>
          </Heading>

          <Text
            maxW="620px"
            color="whiteAlpha.600"
            fontSize={{
              base: "md",
              md: "lg",
            }}
            lineHeight={1.9}
          >
            The page you're looking for doesn't exist, has been moved or is no longer available.
          </Text>

          <Stack
            direction={{
              base: "column",
              sm: "row",
            }}
            spacing={4}
          >
            <Button
              as={Link}
              href="/"
              h="58px"
              px={8}
              borderRadius="full"
              bg="#d9ff43"
              color="#080a08"
              fontWeight={900}
              letterSpacing="0.08em"
              textTransform="uppercase"
              _hover={{
                bg: "#ecff9b",
                transform: "translateY(-2px)",
              }}
            >
              Back Home
            </Button>

            <Button
              as={Link}
              href="/music"
              h="58px"
              px={8}
              borderRadius="full"
              variant="outline"
              borderColor="whiteAlpha.300"
              color="white"
              fontWeight={900}
              letterSpacing="0.08em"
              textTransform="uppercase"
              _hover={{
                borderColor: "#d9ff43",
                color: "#d9ff43",
              }}
            >
              Latest Music
            </Button>
          </Stack>
          <Box mt={8} minH="28px" display="flex" alignItems="center" justifyContent="center">
            <Text
              color="whiteAlpha.500"
              fontSize="sm"
              fontStyle="italic"
              opacity={showQuote ? 1 : 0}
              transform={showQuote ? "translateY(0)" : "translateY(10px)"}
              transition="opacity 0.8s ease, transform 0.8s ease"
            >
              One Love always finds the right direction.
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
