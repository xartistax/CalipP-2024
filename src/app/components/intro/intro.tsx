"use client";
import { Box } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import throttle from 'lodash/throttle';
import Script from 'next/script';
import { ImagePixelated } from "react-pixelate"
import { debounce } from "lodash";

export default function Intro() {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [pixelSize, setPixelSize] = useState(100); // Initial pixel size

  const [isVisible, setIsVisible] = useState(true);

  
  // Update window dimensions
  const updateDimensions = useCallback(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Handle scroll to adjust pixel size
  const handleScroll = useCallback(
    throttle(() => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const newPixelSize = Math.max(5, 100 * (1 - (scrollY / maxScroll)));
      setPixelSize(newPixelSize);
    }, 50), // Throttle time
    []
  );
  

  useEffect(() => {
    updateDimensions(); // Set initial dimensions

    // Add event listeners for resize and scroll
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateDimensions, handleScroll]); // Depend on memoized functions





  return (
    <Box position="relative" width={windowDimensions.width} height="200vh">
      <Box position="fixed" top={0} left={0} width="100vw" height="100vh">

          <ImagePixelated src={'/image.jpg'} width={windowDimensions.width} height={windowDimensions.height} pixelSize={pixelSize} fillTransparencyColor={"grey"} />
   
      </Box>
    </Box>
  );
}
