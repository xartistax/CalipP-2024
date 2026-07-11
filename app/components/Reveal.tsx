"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = BoxProps & {
  children: ReactNode;
  delay?: number;
  distance?: number;
};

export function Reveal({ children, delay = 0, distance = 32, ...boxProps }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: distance,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.7,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box {...boxProps}>{children}</Box>
    </motion.div>
  );
}
