"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  VisuallyHidden,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowRight,
  FaEnvelope,
  FaExternalLinkAlt,
  FaPhone,
  FaShoppingBag,
  FaSpotify,
  FaTiktok,
  FaVolumeMute,
  FaVolumeUp,
  FaYoutube,
} from "react-icons/fa";

const SHOP_URL = "https://senmbelek-store.myshopify.com/";

const SPOTIFY_URL = "https://open.spotify.com/intl-de/artist/3ecsQBXTAjmQyO3Nqq0KZV";

const SPOTIFY_EMBED_URL = "https://open.spotify.com/embed/artist/3ecsQBXTAjmQyO3Nqq0KZV?utm_source=generator&theme=0";

const YOUTUBE_URL = "https://www.youtube.com/calipmusic?sub_confirmation=1";

const TIKTOK_URL = "https://www.tiktok.com/@itscalip";

export default function CaliPWebsite() {
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = useBreakpointValue({
    base: "/video/jah_blessing_mobile.mp4",
    md: "/video/jah_blessing_croped_small.mp4",
  });

  const posterSrc = useBreakpointValue({
    base: "/video/poster_mobile.jpg",
    md: "/video/poster_screen.jpg",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 300);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <Box minH="100vh" overflowX="hidden" bg="#080a08" color="white">
      <Navigation isScrolled={isScrolled} onNavigate={scrollToSection} />

      <Hero
        videoRef={videoRef}
        videoSrc={videoSrc}
        posterSrc={posterSrc}
        isReady={isReady}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onNavigate={scrollToSection}
      />

      <StatementSection />

      <MusicSection />

      <ShopSection />

      <BookingSection />

      <Footer />
    </Box>
  );
}

function Navigation({ isScrolled, onNavigate }: { isScrolled: boolean; onNavigate: (id: string) => void }) {
  return (
    <Flex
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      align="center"
      justify="space-between"
      px={{ base: 5, md: 10 }}
      py={isScrolled ? 3 : 5}
      bg={isScrolled ? "rgba(8, 10, 8, 0.82)" : "transparent"}
      borderBottom="1px solid"
      borderColor={isScrolled ? "whiteAlpha.200" : "transparent"}
      backdropFilter={isScrolled ? "blur(18px)" : "none"}
      transition="all 0.3s ease"
    >
      <Box position="relative" w={{ base: "94px", md: "120px" }} h={{ base: "32px", md: "40px" }} cursor="pointer" onClick={() => onNavigate("home")}>
        <Image
          src="/logo.png"
          alt="Cali P"
          fill
          priority
          sizes="120px"
          style={{
            objectFit: "contain",
            objectPosition: "left center",
          }}
        />
      </Box>

      <HStack display={{ base: "none", md: "flex" }} spacing={8}>
        <NavLink onClick={() => onNavigate("music")}>Music</NavLink>

        <NavLink onClick={() => onNavigate("shop")}>Shop</NavLink>

        <NavLink onClick={() => onNavigate("booking")}>Booking</NavLink>
      </HStack>

      <Button
        as="a"
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        rightIcon={<FaArrowRight />}
        size={{ base: "sm", md: "md" }}
        borderRadius="full"
        bg="#d9ff43"
        color="#080a08"
        px={{ base: 4, md: 6 }}
        fontSize="xs"
        fontWeight={800}
        letterSpacing="0.1em"
        textTransform="uppercase"
        _hover={{
          bg: "#ecff9b",
          transform: "translateY(-2px)",
        }}
      >
        Store
      </Button>
    </Flex>
  );
}

function NavLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      color="whiteAlpha.800"
      fontSize="xs"
      fontWeight={600}
      letterSpacing="0.14em"
      textTransform="uppercase"
      onClick={onClick}
      _hover={{
        color: "#d9ff43",
        bg: "transparent",
      }}
    >
      {children}
    </Button>
  );
}

function Hero({
  videoRef,
  videoSrc,
  posterSrc,
  isReady,
  isMuted,
  onToggleMute,
  onNavigate,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSrc?: string;
  posterSrc?: string;
  isReady: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onNavigate: (id: string) => void;
}) {
  return (
    <Flex id="home" position="relative" minH="100svh" align="center" overflow="hidden" bg="black">
      <Box position="absolute" inset={0}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={posterSrc}
          key={`${videoSrc}-${posterSrc}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isReady ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </Box>

      <Box
        position="absolute"
        inset={0}
        bgGradient={{
          base: "linear(to-b, blackAlpha.400 0%, blackAlpha.300 35%, #080a08 100%)",
          md: "linear(to-r, rgba(8,10,8,0.94) 0%, rgba(8,10,8,0.45) 48%, rgba(8,10,8,0.12) 75%)",
        }}
      />

      <Box position="absolute" inset={0} bgGradient="linear(to-t, #080a08 0%, transparent 30%)" />

      <Box
        position="absolute"
        top="20%"
        right="-15%"
        w={{ base: "300px", md: "700px" }}
        h={{ base: "300px", md: "700px" }}
        borderRadius="full"
        bg="rgba(217, 255, 67, 0.08)"
        filter="blur(100px)"
      />

      <Container position="relative" zIndex={2} maxW="7xl" pt={{ base: 28, md: 32 }} pb={{ base: 24, md: 20 }}>
        <Stack
          maxW={{ base: "full", md: "760px" }}
          spacing={{ base: 7, md: 9 }}
          align={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
          opacity={isReady ? 1 : 0}
          transform={isReady ? "translateY(0)" : "translateY(30px)"}
          transition="opacity 1.2s ease, transform 1.2s ease"
        >
          <HStack spacing={3} color="#d9ff43" fontSize="xs" fontWeight={700} letterSpacing="0.22em" textTransform="uppercase">
            <Box w="34px" h="1px" bg="#d9ff43" />
            <Text>Reggae · Culture · Consciousness</Text>
          </HStack>

          <Box
            position="relative"
            w={{
              base: "260px",
              sm: "340px",
              md: "470px",
            }}
            h={{
              base: "100px",
              sm: "125px",
              md: "170px",
            }}
          >
            <Image
              src="/logo.png"
              alt="Cali P"
              fill
              priority
              sizes="470px"
              style={{
                objectFit: "contain",
                objectPosition: "left center",
                filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.55))",
              }}
            />
          </Box>

          <Heading
            maxW="700px"
            fontSize={{
              base: "3xl",
              sm: "4xl",
              md: "6xl",
              lg: "7xl",
            }}
            lineHeight={{ base: 1.1, md: 0.98 }}
            fontWeight={500}
            letterSpacing="-0.045em"
          >
            Music with a message.
            <Text as="span" color="#d9ff43">
              {" "}
              Energy with purpose.
            </Text>
          </Heading>

          <Text maxW="600px" color="whiteAlpha.700" fontSize={{ base: "md", md: "lg" }} lineHeight={1.8} fontWeight={300}>
            Bridging cultures, elevating consciousness and inspiring change through music.
          </Text>

          <Stack direction={{ base: "column", sm: "row" }} spacing={4} w={{ base: "full", sm: "auto" }}>
            <Button
              as="a"
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaSpotify />}
              size="lg"
              h="58px"
              borderRadius="full"
              bg="#d9ff43"
              color="#080a08"
              px={8}
              fontSize="sm"
              fontWeight={800}
              letterSpacing="0.08em"
              textTransform="uppercase"
              _hover={{
                bg: "#ecff9b",
                transform: "translateY(-3px)",
              }}
            >
              Listen on Spotify
            </Button>

            <Button
              as="a"
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              leftIcon={<FaShoppingBag />}
              size="lg"
              h="58px"
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.400"
              bg="blackAlpha.300"
              color="white"
              px={8}
              fontSize="sm"
              fontWeight={700}
              letterSpacing="0.08em"
              textTransform="uppercase"
              backdropFilter="blur(12px)"
              _hover={{
                bg: "white",
                color: "#080a08",
                borderColor: "white",
              }}
            >
              Visit store
            </Button>
          </Stack>

          <HStack spacing={4} pt={2}>
            <SocialButton label="Spotify" href={SPOTIFY_URL}>
              <FaSpotify />
            </SocialButton>

            <SocialButton label="YouTube" href={YOUTUBE_URL}>
              <FaYoutube />
            </SocialButton>

            <SocialButton label="TikTok" href={TIKTOK_URL}>
              <FaTiktok />
            </SocialButton>

            <SocialButton label="Email" href="mailto:info@calipmusic.com">
              <FaEnvelope />
            </SocialButton>
          </HStack>
        </Stack>
      </Container>

      <Button
        display={{ base: "none", md: "flex" }}
        position="absolute"
        bottom={8}
        left="50%"
        zIndex={3}
        transform="translateX(-50%)"
        variant="ghost"
        color="whiteAlpha.600"
        leftIcon={<FaArrowDown />}
        fontSize="xs"
        letterSpacing="0.18em"
        textTransform="uppercase"
        onClick={() => onNavigate("music")}
        _hover={{
          bg: "transparent",
          color: "#d9ff43",
        }}
      >
        Explore
      </Button>

      <IconButton
        aria-label={isMuted ? "Enable video sound" : "Mute video sound"}
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        position="absolute"
        right={{ base: 5, md: 8 }}
        bottom={{ base: 5, md: 8 }}
        zIndex={3}
        w="48px"
        h="48px"
        borderRadius="full"
        border="1px solid"
        borderColor="whiteAlpha.300"
        bg="blackAlpha.500"
        color="white"
        backdropFilter="blur(12px)"
        onClick={onToggleMute}
        _hover={{
          bg: "#d9ff43",
          color: "#080a08",
          borderColor: "#d9ff43",
        }}
      />
    </Flex>
  );
}

function SocialButton({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  return (
    <chakra.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w="46px"
      h="46px"
      borderRadius="full"
      border="1px solid"
      borderColor="whiteAlpha.300"
      bg="blackAlpha.300"
      color="white"
      backdropFilter="blur(12px)"
      transition="all 0.25s ease"
      _hover={{
        bg: "#d9ff43",
        color: "#080a08",
        borderColor: "#d9ff43",
        transform: "translateY(-4px)",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.a>
  );
}

function StatementSection() {
  return (
    <Box position="relative" py={{ base: 20, md: 32 }} overflow="hidden">
      <Box position="absolute" left="-200px" top="20%" w="500px" h="500px" borderRadius="full" bg="rgba(217, 255, 67, 0.05)" filter="blur(100px)" />

      <Container maxW="7xl">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "0.7fr 1.3fr",
          }}
          gap={{ base: 10, md: 20 }}
          alignItems="start"
        >
          <Stack spacing={4}>
            <SectionLabel>About the movement</SectionLabel>

            <Text color="whiteAlpha.500" fontSize="sm" lineHeight={1.8}>
              Roots music for a connected world.
            </Text>
          </Stack>

          <Stack spacing={8}>
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

            <Text maxW="720px" color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.9}>
              Cali P combines modern reggae energy with conscious messages, international influences and a deep connection to culture. Every song is built to
              move both body and mind.
            </Text>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}

function MusicSection() {
  return (
    <Box id="music" position="relative" py={{ base: 20, md: 28 }} bg="#0d100d" scrollMarginTop="90px">
      <Container maxW="7xl">
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "0.85fr 1.15fr",
          }}
          gap={{ base: 12, lg: 20 }}
          alignItems="center"
        >
          <Stack spacing={8}>
            <SectionLabel>Latest music</SectionLabel>

            <Heading
              fontSize={{
                base: "4xl",
                md: "6xl",
              }}
              lineHeight={1}
              fontWeight={500}
              letterSpacing="-0.045em"
            >
              Turn it up.
              <Text as="span" display="block" color="#d9ff43">
                Feel the message.
              </Text>
            </Heading>

            <Text maxW="560px" color="whiteAlpha.600" fontSize={{ base: "md", md: "lg" }} lineHeight={1.8}>
              Listen to Cali P directly on Spotify and follow the artist to stay updated on new music.
            </Text>

            <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
              <Button
                as="a"
                href={SPOTIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FaSpotify />}
                rightIcon={<FaExternalLinkAlt />}
                borderRadius="full"
                bg="#1ed760"
                color="black"
                px={7}
                _hover={{
                  bg: "#54e582",
                  transform: "translateY(-2px)",
                }}
              >
                Open Spotify
              </Button>

              <Button
                as="a"
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FaYoutube />}
                borderRadius="full"
                variant="outline"
                borderColor="whiteAlpha.300"
                color="white"
                px={7}
                _hover={{
                  bg: "white",
                  color: "black",
                }}
              >
                YouTube
              </Button>
            </Stack>
          </Stack>

          <Box
            position="relative"
            p={{ base: 3, md: 5 }}
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius={{ base: "24px", md: "32px" }}
            bg="whiteAlpha.50"
            boxShadow="0 35px 100px rgba(0,0,0,0.35)"
            _before={{
              content: '""',
              position: "absolute",
              inset: "-1px",
              borderRadius: "inherit",
              padding: "1px",
              bgGradient: "linear(to-br, rgba(217,255,67,0.55), transparent 45%, rgba(255,255,255,0.1))",
              pointerEvents: "none",
            }}
          >
            <Box position="relative" overflow="hidden" borderRadius={{ base: "18px", md: "24px" }}>
              <iframe
                title="Cali P on Spotify"
                src={SPOTIFY_EMBED_URL}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{
                  display: "block",
                  borderRadius: "20px",
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

function ShopSection() {
  return (
    <Box id="shop" position="relative" py={{ base: 20, md: 32 }} overflow="hidden" scrollMarginTop="90px">
      <Box position="absolute" inset={0} bgGradient="linear(to-br, #10140e, #080a08 65%)" />

      <Box position="absolute" top="-180px" right="-100px" w="600px" h="600px" borderRadius="full" bg="rgba(217, 255, 67, 0.09)" filter="blur(120px)" />

      <Container position="relative" maxW="7xl">
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
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function BookingSection() {
  return (
    <Box id="booking" position="relative" py={{ base: 20, md: 28 }} bg="#0d100d" scrollMarginTop="90px">
      <Container maxW="7xl">
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

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <ContactCard label="Management" company="Mouthwatering Records">
            <ContactPerson name="Oriana Wilkinson" phone="+41 78 814 02 40" email="oriana@mouthwateringrecords.com" />

            <Divider borderColor="whiteAlpha.200" />

            <ContactPerson name="Andreas Ryser" email="andreas@mouthwateringrecords.com" />

            <Text color="whiteAlpha.400" fontSize="sm">
              3000 Bern, Switzerland
            </Text>
          </ContactCard>

          <ContactCard label="Booking" company="Nila Agency">
            <ContactPerson name="Ivo Orlik" phone="+41 79 747 92 78" email="ivo@nila-agency.ch" />

            <Text color="whiteAlpha.400" fontSize="sm">
              3700 Chur, Switzerland
            </Text>
          </ContactCard>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function ContactCard({ label, company, children }: { label: string; company: string; children: ReactNode }) {
  return (
    <Stack
      spacing={8}
      minH="390px"
      p={{ base: 7, md: 10 }}
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius={{ base: "24px", md: "32px" }}
      bg="whiteAlpha.50"
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

        <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight={500} letterSpacing="-0.03em">
          {company}
        </Heading>
      </Stack>

      <Stack spacing={7}>{children}</Stack>
    </Stack>
  );
}

function ContactPerson({ name, phone, email }: { name: string; phone?: string; email: string }) {
  return (
    <Stack spacing={4}>
      <Text fontSize="lg" fontWeight={600}>
        {name}
      </Text>

      {phone && (
        <Link
          href={`tel:${phone.replace(/\s/g, "")}`}
          display="flex"
          alignItems="center"
          gap={3}
          color="whiteAlpha.600"
          transition="color 0.2s ease"
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
        href={`mailto:${email}`}
        display="flex"
        alignItems="center"
        gap={3}
        color="whiteAlpha.600"
        wordBreak="break-word"
        transition="color 0.2s ease"
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <HStack spacing={3} color="#d9ff43" fontSize="xs" fontWeight={700} letterSpacing="0.22em" textTransform="uppercase">
      <Box w="30px" h="1px" bg="#d9ff43" />
      <Text>{children}</Text>
    </HStack>
  );
}

function Footer() {
  return (
    <Box borderTop="1px solid" borderColor="whiteAlpha.200" bg="#080a08" py={10}>
      <Container maxW="7xl">
        <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "center", md: "center" }} spacing={8}>
          <Box position="relative" w="100px" h="40px">
            <Image
              src="/logo.png"
              alt="Cali P"
              fill
              sizes="100px"
              style={{
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
          </Box>

          <HStack spacing={4}>
            <SocialButton label="Spotify" href={SPOTIFY_URL}>
              <FaSpotify />
            </SocialButton>

            <SocialButton label="YouTube" href={YOUTUBE_URL}>
              <FaYoutube />
            </SocialButton>

            <SocialButton label="TikTok" href={TIKTOK_URL}>
              <FaTiktok />
            </SocialButton>
          </HStack>

          <Text color="whiteAlpha.400" fontSize="xs" textAlign="center">
            © {new Date().getFullYear()} Cali P. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
