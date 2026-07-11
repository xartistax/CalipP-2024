"use client";

import { Box, Button, Flex, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { FaArrowRight, FaBars, FaShoppingBag, FaTimes } from "react-icons/fa";
import { SHOP_URL } from "./CaliPWebsite";

type NavigationProps = {
  isScrolled: boolean;
  onNavigate: (id: string) => void;
};

const navigationItems = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "music",
    label: "Music",
  },
  {
    id: "shop",
    label: "Shop",
  },
  {
    id: "booking",
    label: "Booking",
  },
];

export function Navigation({ isScrolled, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = navigationItems.map((item) => document.getElementById(item.id)).filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const currentSection = visibleEntries[0];

        if (currentSection) {
          setActiveSection(currentSection.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavigation = (id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <Flex
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={200}
        align="center"
        justify="space-between"
        px={{ base: 5, md: 10 }}
        py={{
          base: 4,
          md: isScrolled ? 3 : 5,
        }}
        bg={isScrolled || isMenuOpen ? "rgba(8, 10, 8, 0.82)" : "transparent"}
        borderBottom="1px solid"
        borderColor={isScrolled || isMenuOpen ? "whiteAlpha.200" : "transparent"}
        backdropFilter={isScrolled || isMenuOpen ? "blur(22px)" : "none"}
        transition="all 0.3s ease"
      >
        {/* Logo */}
        <Box
          as="button"
          type="button"
          position="relative"
          w={{
            base: "94px",
            md: isScrolled ? "105px" : "120px",
          }}
          h={{
            base: "32px",
            md: isScrolled ? "35px" : "40px",
          }}
          cursor="pointer"
          transition="all 0.3s ease"
          onClick={() => handleNavigation("home")}
          aria-label="Go to homepage"
        >
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

        {/* Desktop Navigation */}
        <HStack
          display={{ base: "none", md: "flex" }}
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          spacing={2}
          p={1}
          borderRadius="full"
          bg={isScrolled ? "whiteAlpha.50" : "transparent"}
          border="1px solid"
          borderColor={isScrolled ? "whiteAlpha.100" : "transparent"}
          transition="all 0.3s ease"
        >
          {navigationItems
            .filter((item) => item.id !== "home")
            .map((item) => (
              <NavLink key={item.id} isActive={activeSection === item.id} onClick={() => handleNavigation(item.id)}>
                {item.label}
              </NavLink>
            ))}
        </HStack>

        {/* Desktop Store Button */}
        <Button
          as="a"
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          display={{ base: "none", md: "inline-flex" }}
          rightIcon={<FaArrowRight />}
          borderRadius="full"
          bg="#d9ff43"
          color="#080a08"
          px={6}
          fontSize="xs"
          fontWeight={800}
          letterSpacing="0.1em"
          textTransform="uppercase"
          transition="all 0.25s ease"
          _hover={{
            bg: "#ecff9b",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 35px rgba(217,255,67,0.16)",
          }}
        >
          Store
        </Button>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "inline-flex", md: "none" }}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          icon={isMenuOpen ? <FaTimes /> : <FaBars />}
          w="44px"
          h="44px"
          minW="44px"
          borderRadius="full"
          border="1px solid"
          borderColor="whiteAlpha.300"
          bg="blackAlpha.400"
          color="white"
          backdropFilter="blur(12px)"
          transition="all 0.25s ease"
          onClick={() => setIsMenuOpen((current) => !current)}
          _hover={{
            bg: "#d9ff43",
            color: "#080a08",
            borderColor: "#d9ff43",
          }}
        />
      </Flex>

      {/* Mobile Fullscreen Menu */}
      <Flex
        display={{ base: "flex", md: "none" }}
        position="fixed"
        inset={0}
        zIndex={150}
        direction="column"
        justify="center"
        px={6}
        pt="90px"
        pb={10}
        bg="rgba(5, 7, 5, 0.97)"
        backdropFilter="blur(24px)"
        opacity={isMenuOpen ? 1 : 0}
        visibility={isMenuOpen ? "visible" : "hidden"}
        pointerEvents={isMenuOpen ? "auto" : "none"}
        transform={isMenuOpen ? "translateY(0)" : "translateY(-20px)"}
        transition="
          opacity 0.3s ease,
          transform 0.3s ease,
          visibility 0.3s ease
        "
        overflow="hidden"
      >
        {/* Background Glow */}
        <Box
          position="absolute"
          top="15%"
          right="-180px"
          w="460px"
          h="460px"
          borderRadius="full"
          bg="rgba(217,255,67,0.09)"
          filter="blur(110px)"
          pointerEvents="none"
        />

        <Box
          position="absolute"
          left="-160px"
          bottom="-180px"
          w="420px"
          h="420px"
          borderRadius="full"
          bg="rgba(30,215,96,0.06)"
          filter="blur(110px)"
          pointerEvents="none"
        />

        <Stack position="relative" spacing={2} w="full">
          {navigationItems.map((item, index) => (
            <Button
              key={item.id}
              variant="ghost"
              justifyContent="space-between"
              w="full"
              h="auto"
              py={4}
              px={2}
              borderRadius={0}
              borderBottom="1px solid"
              borderColor="whiteAlpha.200"
              color={activeSection === item.id ? "#d9ff43" : "white"}
              fontSize={{
                base: "3xl",
                sm: "4xl",
              }}
              fontWeight={500}
              letterSpacing="-0.035em"
              opacity={isMenuOpen ? 1 : 0}
              transform={isMenuOpen ? "translateX(0)" : "translateX(-24px)"}
              transition={`
                opacity 0.35s ease ${index * 0.06}s,
                transform 0.35s ease ${index * 0.06}s,
                color 0.2s ease
              `}
              onClick={() => handleNavigation(item.id)}
              _hover={{
                bg: "transparent",
                color: "#d9ff43",
              }}
            >
              <Text>{item.label}</Text>

              <Text color="whiteAlpha.300" fontSize="xs" fontWeight={700} letterSpacing="0.14em">
                {String(index + 1).padStart(2, "0")}
              </Text>
            </Button>
          ))}
        </Stack>

        <Button
          as="a"
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<FaShoppingBag />}
          rightIcon={<FaArrowRight />}
          mt={10}
          w="full"
          h="60px"
          borderRadius="full"
          bg="#d9ff43"
          color="#080a08"
          fontSize="sm"
          fontWeight={900}
          letterSpacing="0.1em"
          textTransform="uppercase"
          opacity={isMenuOpen ? 1 : 0}
          transform={isMenuOpen ? "translateY(0)" : "translateY(20px)"}
          transition="
            opacity 0.35s ease 0.25s,
            transform 0.35s ease 0.25s
          "
          _hover={{
            bg: "#ecff9b",
          }}
        >
          Visit official store
        </Button>
      </Flex>
    </>
  );
}

type NavLinkProps = {
  children: ReactNode;
  isActive?: boolean;
  onClick: () => void;
};

export function NavLink({ children, isActive = false, onClick }: NavLinkProps) {
  return (
    <Button
      position="relative"
      variant="ghost"
      borderRadius="full"
      color={isActive ? "#d9ff43" : "whiteAlpha.800"}
      bg={isActive ? "rgba(217,255,67,0.08)" : "transparent"}
      px={5}
      fontSize="xs"
      fontWeight={700}
      letterSpacing="0.14em"
      textTransform="uppercase"
      onClick={onClick}
      transition="all 0.25s ease"
      _hover={{
        color: "#d9ff43",
        bg: "rgba(217,255,67,0.06)",
      }}
      _after={{
        content: '""',
        position: "absolute",
        left: "50%",
        bottom: "3px",
        w: isActive ? "18px" : "0",
        h: "1px",
        bg: "#d9ff43",
        transform: "translateX(-50%)",
        transition: "width 0.25s ease",
      }}
    >
      {children}
    </Button>
  );
}
