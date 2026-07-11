import { Box, Container, Grid, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function StatementSection() {
  return (
    <Box position="relative" py={{ base: 20, md: 32 }} overflow="hidden">
      <Box
        position="absolute"
        left="-200px"
        top="20%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="rgba(217, 255, 67, 0.05)"
        filter="blur(100px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "0.7fr 1.3fr",
          }}
          gap={{ base: 10, md: 20 }}
          alignItems="start"
        >
          <Reveal distance={24}>
            <Stack spacing={4}>
              <SectionLabel>About the movement</SectionLabel>

              <Text color="whiteAlpha.500" fontSize="sm" lineHeight={1.8}>
                Roots music for a connected world.
              </Text>
            </Stack>
          </Reveal>

          <Stack spacing={8}>
            <Reveal delay={0.08} distance={28}>
              <Heading
                fontSize={{
                  base: "3xl",
                  md: "5xl",
                  lg: "6xl",
                }}
                lineHeight={1.08}
                fontWeight={400}
                letterSpacing="-0.04em"
              >
                More than entertainment.
                <Text as="span" color="#d9ff43">
                  {" "}
                  Music can connect, uplift and transform.
                </Text>
              </Heading>
            </Reveal>

            <Reveal delay={0.16} distance={22}>
              <Text maxW="720px" color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.9}>
                Cali P combines modern reggae energy with conscious messages, international influences and a deep connection to culture. Every song is built to
                move both body and mind.
              </Text>
            </Reveal>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <HStack spacing={3} color="#d9ff43" fontSize="xs" fontWeight={700} letterSpacing="0.22em" textTransform="uppercase">
      <Box w="30px" h="1px" bg="#d9ff43" />
      <Text>{children}</Text>
    </HStack>
  );
}
