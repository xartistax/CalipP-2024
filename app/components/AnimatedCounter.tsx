"use client";

import { Text, TextProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = TextProps & {
  value: number;
  duration?: number;
};

export function AnimatedCounter({ value, duration = 1200, ...props }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;

        hasAnimated.current = true;

        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Weiches Abbremsen am Ende
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setDisplayValue(Math.round(value * easedProgress));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      {
        threshold: 0.4,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [duration, value]);

  return (
    <Text ref={counterRef} {...props}>
      {displayValue.toLocaleString("en-US")}
    </Text>
  );
}
