"use client";

import { VStack, Stack, useBreakpointValue, Text, Heading, Link, Box, Container } from "@chakra-ui/react";

export default function Contact() {
  const textSize = useBreakpointValue({ base: "sm", md: "md" });
  return (
    <Box minH="100vh" py={{ base: 10, md: 16 }} id="booking">
      <Container maxW="3xl">
        <VStack spacing={{ base: 8, md: 10 }} align="center" textAlign="center">
          {/* Management */}
          <Stack spacing={2} w="full" maxW="2xl">
            <Heading size="md" pt={2}>
              Management
            </Heading>

            <Stack spacing={6} fontSize={textSize} lineHeight={1.6} fontWeight={300}>
              <Stack spacing={2}>
                <Text fontWeight={600} letterSpacing="0.02em">
                  MOUTHWATERING RECORDS
                </Text>
                <Text>Oriana Wilkinson</Text>
                <Link href="tel:+41788140240" textDecoration="underline">
                  +41 78 814 02 40
                </Link>
                <Link href="mailto:oriana@mouthwateringrecords.com" textDecoration="underline">
                  oriana@mouthwateringrecords.com
                </Link>
                <Text>3000 Bern, CH</Text>
              </Stack>

              <Stack spacing={2}>
                <Text>Andreas Ryser</Text>
                <Link href="mailto:andreas@mouthwateringrecords.com" textDecoration="underline">
                  andreas@mouthwateringrecords.com
                </Link>
              </Stack>
            </Stack>
          </Stack>

          {/* Booking */}
          <Stack spacing={2} w="full" maxW="2xl">
            <Heading size="md" pt={2}>
              Booking
            </Heading>

            <Stack spacing={2} fontSize={textSize} lineHeight={1.6} fontWeight={300}>
              <Text fontWeight={600} letterSpacing="0.02em">
                NILA AGENCY
              </Text>
              <Text>Ivo Orlik</Text>
              <Link href="tel:+41797479278" textDecoration="underline">
                +41 79 747 92 78
              </Link>
              <Link href="mailto:ivo@nila-agency.ch" textDecoration="underline">
                ivo@nila-agency.ch
              </Link>
              <Text>37000 Chur, CH</Text>
            </Stack>
          </Stack>

          {/* Social Icons (optional) */}
          {/* <HStack spacing={6} pt={2} /> */}
        </VStack>
      </Container>
    </Box>
  );
}
