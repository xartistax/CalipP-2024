"use client";
import { Box, Container, Divider, Heading, Icon, Link, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./StatementSection";
import { trackEvent } from "../../lib/analytics";

export function BookingSection() {
  return (
    <Box id="booking" position="relative" py={{ base: 20, md: 28 }} bg="#0d100d" scrollMarginTop="90px" overflow="hidden">
      <Box
        position="absolute"
        left="-180px"
        bottom="-220px"
        w="520px"
        h="520px"
        borderRadius="full"
        bg="rgba(217,255,67,0.05)"
        filter="blur(120px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Reveal distance={28}>
          <VStack mb={{ base: 12, md: 16 }} spacing={5} textAlign="center">
            <SectionLabel>Contact</SectionLabel>

            <Heading
              fontSize={{
                base: "4xl",
                md: "6xl",
              }}
              fontWeight={500}
              letterSpacing="-0.045em"
            >
              Bring Cali P to your stage.
            </Heading>

            <Text maxW="650px" color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.8}>
              For bookings, collaborations and management enquiries, contact the respective team.
            </Text>
          </VStack>
        </Reveal>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Reveal delay={0.08} distance={24} h="full">
            <ContactCard label="Management" company="Mouthwatering Records">
              <ContactPerson
                name="Oriana Wilkinson"
                phone="+41 78 814 02 40"
                email="oriana@mouthwateringrecords.com"
                company="Mouthwatering Records"
                contactType="management"
              />

              <Divider borderColor="whiteAlpha.200" />

              <ContactPerson name="Andreas Ryser" email="andreas@mouthwateringrecords.com" company="Mouthwatering Records" contactType="management" />

              <Text color="whiteAlpha.400" fontSize="sm">
                3000 Bern, Switzerland
              </Text>
            </ContactCard>
          </Reveal>

          <Reveal delay={0.16} distance={24} h="full">
            <ContactCard label="Booking" company="Nila Agency">
              <ContactPerson name="Ivo Orlik" phone="+41 79 747 92 78" email="ivo@nila-agency.ch" company="Nila Agency" contactType="booking" />

              <Text color="whiteAlpha.400" fontSize="sm">
                3700 Chur, Switzerland
              </Text>
            </ContactCard>
          </Reveal>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function ContactCard({ label, company, children }: { label: string; company: string; children: ReactNode }) {
  return (
    <Stack
      spacing={8}
      h="full"
      minH="390px"
      p={{ base: 7, md: 10 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius={{ base: "24px", md: "32px" }}
      bg="whiteAlpha.50"
      backdropFilter="blur(14px)"
      transition="all 0.3s ease"
      _hover={{
        borderColor: "rgba(217,255,67,0.55)",
        transform: "translateY(-6px)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
      }}
    >
      <Stack spacing={3}>
        <Text color="#d9ff43" fontSize="xs" fontWeight={700} letterSpacing="0.2em" textTransform="uppercase">
          {label}
        </Text>

        <Heading as={"h2"} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={500} letterSpacing="-0.03em">
          {company}
        </Heading>
      </Stack>

      <Stack spacing={7}>{children}</Stack>
    </Stack>
  );
}

function ContactPerson({
  name,
  company,
  contactType,
  phone,
  email,
}: {
  name: string;
  company: string;
  contactType: "management" | "booking";
  phone?: string;
  email: string;
}) {
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;

  const emailHref = `mailto:${email}`;

  return (
    <Stack spacing={4}>
      <Text fontSize="lg" fontWeight={600}>
        {name}
      </Text>

      {phone && phoneHref && (
        <Link
          href={phoneHref}
          display="flex"
          alignItems="center"
          gap={3}
          color="whiteAlpha.600"
          transition="color 0.2s ease"
          onClick={() =>
            trackEvent("booking_phone_click", {
              location: "booking_section",
              contact_name: name,
              company,
              contact_type: contactType,
              phone_number: phone,
              destination_url: phoneHref,
            })
          }
          _hover={{
            color: "#d9ff43",
            textDecoration: "none",
          }}
        >
          <Icon as={FaPhone} boxSize={3.5} />
          {phone}
        </Link>
      )}

      <Link
        href={emailHref}
        display="flex"
        alignItems="center"
        gap={3}
        color="whiteAlpha.600"
        wordBreak="break-word"
        transition="color 0.2s ease"
        onClick={() =>
          trackEvent("booking_email_click", {
            location: "booking_section",
            contact_name: name,
            company,
            contact_type: contactType,
            email_address: email,
            destination_url: emailHref,
          })
        }
        _hover={{
          color: "#d9ff43",
          textDecoration: "none",
        }}
      >
        <Icon as={FaEnvelope} boxSize={3.5} />
        {email}
      </Link>
    </Stack>
  );
}
