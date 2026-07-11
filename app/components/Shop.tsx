import { Box, Button, Container, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { SHOP_URL } from "./CaliPWebsite";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./StatementSection";

export function ShopSection() {
  return (
    <Box id="shop" position="relative" py={{ base: 20, md: 32 }} overflow="hidden" scrollMarginTop="90px">
      <Box position="absolute" inset={0} bgGradient="linear(to-br, #10140e, #080a08 65%)" />

      <Box
        position="absolute"
        top="-180px"
        right="-100px"
        w="600px"
        h="600px"
        borderRadius="full"
        bg="rgba(217, 255, 67, 0.09)"
        filter="blur(120px)"
        pointerEvents="none"
      />

      <Container position="relative" maxW="7xl">
        <Reveal distance={36}>
          <Box
            position="relative"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius={{ base: "28px", md: "48px" }}
            bg="rgba(255,255,255,0.035)"
            px={{ base: 7, md: 16 }}
            py={{ base: 12, md: 20 }}
          >
            <Text
              position="absolute"
              right={{ base: "-30px", md: "30px" }}
              bottom={{ base: "-15px", md: "-45px" }}
              color="whiteAlpha.50"
              fontSize={{
                base: "100px",
                md: "190px",
              }}
              fontWeight={900}
              lineHeight={1}
              letterSpacing="-0.08em"
              pointerEvents="none"
            >
              STORE
            </Text>

            <Grid
              position="relative"
              templateColumns={{
                base: "1fr",
                md: "1.25fr 0.75fr",
              }}
              gap={{ base: 10, md: 16 }}
              alignItems="center"
            >
              <Reveal delay={0.08} distance={24}>
                <Stack spacing={7}>
                  <SectionLabel>Official store</SectionLabel>

                  <Heading
                    maxW="760px"
                    fontSize={{
                      base: "4xl",
                      md: "6xl",
                      lg: "7xl",
                    }}
                    lineHeight={0.98}
                    fontWeight={500}
                    letterSpacing="-0.05em"
                  >
                    Wear the culture.
                    <Text as="span" display="block" color="#d9ff43">
                      Support the movement.
                    </Text>
                  </Heading>

                  <Text maxW="600px" color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.8}>
                    Discover official Cali P products and exclusive merchandise in the online store.
                  </Text>
                </Stack>
              </Reveal>

              <Reveal delay={0.18} distance={20}>
                <Flex justify={{ base: "flex-start", md: "flex-end" }} align="center">
                  <Button
                    as="a"
                    href={SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    rightIcon={<FaArrowRight />}
                    w={{ base: "full", sm: "auto" }}
                    h={{ base: "62px", md: "72px" }}
                    borderRadius="full"
                    bg="#d9ff43"
                    color="#080a08"
                    px={{ base: 8, md: 11 }}
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight={900}
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                    _hover={{
                      bg: "#ecff9b",
                      transform: "scale(1.04)",
                      boxShadow: "0 20px 60px rgba(217,255,67,0.18)",
                    }}
                  >
                    Enter the store
                  </Button>
                </Flex>
              </Reveal>
            </Grid>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
}
