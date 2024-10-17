"use client";
import { Box } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import throttle from 'lodash/throttle';
import Image from 'next/image';
import { ImagePixelated } from "react-pixelate";

export default function Intro() {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [pixelSize, setPixelSize] = useState(100); // Initial pixel size
  const [fadeOut, setFadeOut] = useState(false); // State to control fade out of the pixelated image
  const [imageLoaded, setImageLoaded] = useState(false); // To track when the static image has fully loaded

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
      if (!fadeOut) {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const newPixelSize = Math.max(5, 100 * (1 - (scrollY / maxScroll)));
        setPixelSize(newPixelSize);

        if (newPixelSize === 5) {
          setFadeOut(true); // Trigger fade out of pixelated image
          window.scrollTo(0, 0); // Reset scroll position to the top
        }
      }
    }, 10), // Throttle time
    [fadeOut] // Include fadeOut in the dependency array
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
    <Box position="relative" width={windowDimensions.width} height={fadeOut ? ('100vh') : ('150vh')}>
      {/* Pixelated image */}
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        style={{
          opacity: fadeOut ? 0 : 1, // Fade out pixelated image
          transition: 'opacity 0.01s ease-in-out', // Smoother fade out
          zIndex: 0, // Ensure it's on top during the transition
          WebkitBackfaceVisibility: 'hidden', // Prevent flicker during transition
          backfaceVisibility: 'hidden',
        }}
      >
        <ImagePixelated
          src={'/image1.gif'}
          width={windowDimensions.width}
          height={windowDimensions.height}
          pixelSize={pixelSize}
          fillTransparencyColor={"grey"}
        />
      </Box>

      {/* Static image */}
      <Box
        position="relative"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        style={{
          opacity: fadeOut && imageLoaded ? 1 : 0, // Fade in static image only if it's loaded
          transition: 'opacity 0.3s ease-in-out', // Match transition timing
          zIndex: 1, // Ensure it's behind the pixelated image during the transition
          WebkitBackfaceVisibility: 'hidden', // Prevent flicker during transition
          backfaceVisibility: 'hidden',
        }}
      >
        <Image
          alt="Static Image"
          src="/image1.gif"
          width={windowDimensions.width}
          height={windowDimensions.height}
          onLoad={() => setImageLoaded(true)} // Ensure the image is fully loaded before it becomes visible
        />
      </Box>
    </Box>
  );
}
