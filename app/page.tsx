"use client";
import { Box } from "@chakra-ui/react";
import Intro from "./components/intro/intro";
import Contact from "./components/contact/page";

export default function Home() {
  return (
    <Box>
      <main>
        <Intro />
        <Contact />
      </main>
    </Box>
  );
}
