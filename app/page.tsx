"use client";

import { Box } from "@chakra-ui/react";
import Intro from "./components/intro/intro";
import Contact from "./components/contact/page";

export default function Home() {
  return (
    <Box bg="#0b0b0b" color="white">
      <main>
        <Intro />
        <Contact />
      </main>
    </Box>
  );
}
