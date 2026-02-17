"use client";

import React from "react";
import { useGuide } from "./guide-provider";

export default function GuideTriggerFloating() {
  const { startTour, optOut, hasCompleted, hasOptedOut } = useGuide();

  if (hasOptedOut) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2">
      <button
        id="guide-me-button"
        className="rounded-full px-4 py-2 bg-purple-600 text-white shadow-md hover:bg-purple-700"
        onClick={startTour}
      >
        Guide me
      </button>
      {!hasCompleted && (
        <button
          className="rounded-full px-3 py-2 bg-muted text-foreground/70 hover:bg-muted/80"
          onClick={optOut}
        >
          Don't show again
        </button>
      )}
    </div>
  );
}
