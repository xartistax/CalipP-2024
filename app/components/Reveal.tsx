"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

type RevealProps = BoxProps & {
  children: ReactNode;
  delay?: number;
  distance?: number;
};

export function Reveal({ children, delay = 0, distance = 32, ...boxProps }: RevealProps) {
  const { ref, isVisible } = useReveal();

  return (
    <Box
      ref={ref}
      w="full"
      opacity={isVisible ? 1 : 0}
      transform={isVisible ? "translateY(0)" : `translateY(${distance}px)`}
      transition={`
        opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s,
        transform .7s cubic-bezier(.22,1,.36,1) ${delay}s
      `}
      willChange={isVisible ? "auto" : "opacity, transform"}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
