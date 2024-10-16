"use client";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Pixelify } from "react-pixelify";
import throttle from 'lodash/throttle';

export default function Intro() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 });
  const [pixelSize, setPixelSize] = useState(100); // Initial pixel size

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      console.log("Window resized:", window.innerWidth, window.innerHeight);
    };

    // Throttle scroll handling for smooth transitions
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight; // Total scrollable distance
      console.log("ScrollY:", scrollY, "MaxScroll:", maxScroll);

      // Calculate new pixel size
      const newPixelSize = Math.max(0, 100 * (1 - scrollY / maxScroll));
      console.log("New Pixel Size:", newPixelSize);

      // Ensure pixel size does not exceed bounds
      setPixelSize(newPixelSize);
    }, 50); // Throttle the scroll event to fire every 50ms for smoother transitions

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", handleScroll); // Add scroll listener

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", handleScroll); // Clean up listener
    };
  }, []);

  return (
    <Box
      position="relative"
      width={windowDimensions.width}
      height="200vh" // Allows full 100% scroll
      overflow="hidden"
      margin="0"
      padding="0"
    >
      <Box position="fixed" top={0} left={0} width="100vw" height="100vh">
        <Pixelify
          src="/image.webp" // Reference the image in the public directory
          pixelSize={pixelSize} // Use the pixelSize state
          width={windowDimensions.width}
          height={windowDimensions.height}
          style={{ position: 'absolute', top: 0, left: 0 }} 
        />
      </Box>

     
    </Box>
  );
}
