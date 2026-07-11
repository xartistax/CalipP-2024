"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

const items = ["One Love", "Unity", "Positive Vibrations", "Reggae Music", "Cali P", "Consciousness"];

export function Marquee() {
  const repeatedItems = [...items, ...items];

  return (
    <Box overflow="hidden" borderTop="1px solid" borderBottom="1px solid" borderColor="whiteAlpha.200" bg="#d9ff43" color="#080a08" py={{ base: 3, md: 4 }}>
      <HStack className="footer-marquee" spacing={8} w="max-content" whiteSpace="nowrap">
        {repeatedItems.map((item, index) => (
          <HStack key={`${item}-${index}`} spacing={8}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight={900} letterSpacing="0.12em" textTransform="uppercase">
              {item}
            </Text>

            <Text fontSize="sm">●</Text>
          </HStack>
        ))}
      </HStack>
    </Box>
  );
}
