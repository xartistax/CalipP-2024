"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const MotionBox = motion(Box);

type RevealProps = BoxProps & {
  children: ReactNode;
  delay?: number;
  distance?: number;
};

export function Reveal({ children, delay = 0, distance = 32, ...props }: RevealProps) {
  return (
    <MotionBox
      initial={{
        opacity: 0,
        y: distance,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </MotionBox>
  );
}
