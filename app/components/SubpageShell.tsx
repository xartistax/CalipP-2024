"use client";

import { Box } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

type SubpageShellProps = {
  children: ReactNode;
};

export function SubpageShell({ children }: SubpageShellProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box minH="100vh" overflowX="hidden" bg="#080a08" color="white">
      <Navigation isScrolled={isScrolled} />

      <Box as="main" pt={{ base: "76px", md: "88px" }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
