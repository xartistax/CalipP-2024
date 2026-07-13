"use client";

import { sendGAEvent } from "@next/third-parties/google";

type EventParameters = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, parameters: EventParameters = {}) {
  sendGAEvent("event", eventName, parameters);
}
