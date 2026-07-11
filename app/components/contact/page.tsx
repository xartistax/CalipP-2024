"use client";

import { Box, Button, Container, Divider, Heading, Link, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaShoppingBag } from "react-icons/fa";

const SHOP_URL = "https://senmbelek-store.myshopify.com/";

export default function Contact() {
  return (
    <Box id="booking" position="relative" overflow="hidden" bg="#0b0b0b" color="white" py={{ base: 20, md: 28 }}>
      <Box
        position="absolute"
        top="-200px"
        left="50%"
        transform="translateX(-50%)"
        w="600px"
        h="400px"
        borderRadius="full"
        bg="whiteAlpha.100"
        filter="blur(120px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="6xl">
        <VStack spacing={{ base: 12, md: 16 }}>
          <Stack spacing={4} textAlign="center" maxW="650px">
            <Text color="whiteAlpha.600" fontSize="sm" fontWeight={600} textTransform="uppercase" letterSpacing="0.25em">
              Get in touch
            </Text>

            <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight={500} letterSpacing="-0.03em">
              Management & Booking
            </Heading>

            <Text color="whiteAlpha.700" fontSize={{ base: "md", md: "lg" }} fontWeight={300} lineHeight={1.8}>
              For bookings, collaborations and management enquiries, contact the respective team below.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            <ContactCard title="Management" company="Mouthwatering Records">
              <Stack spacing={5}>
                <ContactPerson name="Oriana Wilkinson" phone="+41 78 814 02 40" email="oriana@mouthwateringrecords.com" />

                <Divider borderColor="whiteAlpha.200" />

                <ContactPerson name="Andreas Ryser" email="andreas@mouthwateringrecords.com" />

                <Text color="whiteAlpha.500" fontSize="sm">
                  3000 Bern, Switzerland
                </Text>
              </Stack>
            </ContactCard>

            <ContactCard title="Booking" company="Nila Agency">
              <Stack spacing={5}>
                <ContactPerson name="Ivo Orlik" phone="+41 79 747 92 78" email="ivo@nila-agency.ch" />

                <Text color="whiteAlpha.500" fontSize="sm">
                  3700 Chur, Switzerland
                </Text>
              </Stack>
            </ContactCard>
          </SimpleGrid>

          <Stack align="center" spacing={5} pt={{ base: 4, md: 8 }} textAlign="center">
            <Text color="whiteAlpha.600">Discover official Cali P products and merchandise.</Text>

            <Button
              as="a"
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaShoppingBag />}
              size="lg"
              borderRadius="full"
              bg="white"
              color="black"
              px={9}
              textTransform="uppercase"
              letterSpacing="0.1em"
              fontSize="sm"
              _hover={{
                bg: "whiteAlpha.900",
                transform: "translateY(-2px)",
              }}
            >
              Visit the shop
            </Button>
          </Stack>

          <Text color="whiteAlpha.400" fontSize="xs" pt={8}>
            © {new Date().getFullYear()} Cali P. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

function ContactCard({ title, company, children }: { title: string; company: string; children: React.ReactNode }) {
  return (
    <Stack
      spacing={7}
      h="full"
      p={{ base: 7, md: 10 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="2xl"
      bg="whiteAlpha.50"
      backdropFilter="blur(12px)"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "whiteAlpha.400",
        transform: "translateY(-4px)",
      }}
    >
      <Stack spacing={2}>
        <Text color="whiteAlpha.500" fontSize="xs" fontWeight={600} textTransform="uppercase" letterSpacing="0.2em">
          {title}
        </Text>

        <Heading size="md" fontWeight={500}>
          {company}
        </Heading>
      </Stack>

      {children}
    </Stack>
  );
}

function ContactPerson({ name, phone, email }: { name: string; phone?: string; email: string }) {
  return (
    <Stack spacing={3}>
      <Text fontWeight={600}>{name}</Text>

      {phone && (
        <Link
          href={`tel:${phone.replace(/\s/g, "")}`}
          display="flex"
          alignItems="center"
          gap={3}
          color="whiteAlpha.700"
          _hover={{ color: "white", textDecoration: "none" }}
        >
          <FaPhone size={13} />
          {phone}
        </Link>
      )}

      <Link
        href={`mailto:${email}`}
        display="flex"
        alignItems="center"
        gap={3}
        color="whiteAlpha.700"
        wordBreak="break-word"
        _hover={{ color: "white", textDecoration: "none" }}
      >
        <FaEnvelope size={13} />
        {email}
      </Link>
    </Stack>
  );
}
