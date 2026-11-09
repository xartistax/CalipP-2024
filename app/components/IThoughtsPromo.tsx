"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { trackEvent } from "../../lib/analytics";

export function IThoughtsPromo() {
  return (
    <Box
      as="section"
      id="ithoughts"
      position="relative"
      bg="#080808"
      py={{ base: 20, md: 28 }}
      px={{ base: 5, md: 8 }}
      overflow="hidden"
      scrollMarginTop="90px"
    >
      <Box
        position="absolute"
        top="20%"
        left="50%"
        transform="translateX(-50%)"
        w="700px"
        h="400px"
        bg="radial-gradient(ellipse, rgba(245,181,46,0.10), transparent 70%)"
        pointerEvents="none"
      />

      <Flex
        maxW="1100px"
        mx="auto"
        direction="column"
        align="center"
        textAlign="center"
        position="relative"
        zIndex={1}
      >
        <Text
          color="#var(--color-theme)"
          fontSize="11px"
          fontWeight="bold"
          letterSpacing="4px"
          mb={8}
        >
          10TH ANNIVERSARY · DELUXE EDITION
        </Text>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%" }}
        >
          <Box
            position="relative"
            w="100%"
            maxW="850px"
            mx="auto"
            aspectRatio={2.73}
          >
            <Image
              src="/albums/i-thoughts-10years/ithoughts-gold.png"
              alt="iThoughts – 10 Years"
              fill
              sizes="(max-width: 768px) 90vw, 850px"
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        </motion.div>

        <Heading
          as="h2"
          color="white"
          fontSize={{ base: "30px", md: "48px" }}
          fontWeight={800}
          letterSpacing="-1px"
          mt={10}
          mb={5}
        >
          10 YEARS OF iTHOUGHTS
        </Heading>

        <Text
          color="#999"
          fontSize={{ base: "14px", md: "17px" }}
          lineHeight={1.9}
          maxW="550px"
          mb={10}
        >
          15 tracks. One exclusive experience.
          <br />
          Unlock the anniversary album with your NFC card.
        </Text>

        <Flex
          gap={4}
          direction={{ base: "column", sm: "row" }}
          w={{ base: "100%", sm: "auto" }}
        >
          <Link
            href="/account"
            onClick={() =>
              trackEvent("ithoughts_promo_click", {
                destination: "account",
                campaign: "nfc_promo_2026",
              })
            }
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "17px 32px",
              background: "var(--color-theme)",
              color: "#050505",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "1px",
              textDecoration: "none",
            }}
          >
            ACCESS YOUR ALBUM →
          </Link>

          <Link
            href="/login"
            onClick={() =>
              trackEvent("ithoughts_promo_click", {
                destination: "login",
                campaign: "nfc_promo_2026",
              })
            }
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "17px 32px",
              border: "1px solid #var(--color-theme)",
              color: "#var(--color-theme)",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              textDecoration: "none",
            }}
          >
            ALREADY REGISTERED? SIGN IN
          </Link>
        </Flex>

        <Text mt={8} color="#666" fontSize="11px" letterSpacing="1px">
          EXCLUSIVELY AVAILABLE WITH AN NFC ALBUM CARD
        </Text>
      </Flex>
    </Box>
  );
}
