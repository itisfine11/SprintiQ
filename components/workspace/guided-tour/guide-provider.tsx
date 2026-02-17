"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStepsForPath } from "./steps";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type GuideContextValue = {
  run: boolean;
  startTour: () => void;
  stopTour: () => void;
  optOut: () => void;
  reset: () => void;
  hasCompleted: boolean;
  hasOptedOut: boolean;
};

const GuideContext = createContext<GuideContextValue | undefined>(undefined);

const LS_COMPLETED_KEY = "sprintiq_tour_completed";
const LS_OPTOUT_KEY = "sprintiq_tour_opt_out";
const LS_START_NEXT_KEY = "sprintiq_tour_start_next";

export function GuideProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [run, setRun] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasOptedOut, setHasOptedOut] = useState(false);
  const [steps, setSteps] = useState<DriveStep[]>([]);
  const isDesktop =
    typeof window === "undefined" ? true : window.innerWidth >= 1024;
  const pendingRouteRef = useRef<string | null>(null);
  const driverRef = useRef<Driver | null>(null);

  const ensureDriver = useCallback(() => {
    if (!driverRef.current) {
      driverRef.current = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        animate: true,
        overlayOpacity: 0.5,
        onDestroyed: () => setRun(false),
        onNextClick: (el, step) => {
          const route = (step as any).route as string | undefined;
          if (route) {
            pendingRouteRef.current = route;
            // End the current tour so we can navigate and restart on the next page
            driverRef.current?.destroy();
            return;
          }
          driverRef.current?.moveNext();
        },
        onPrevClick: () => {
          driverRef.current?.movePrevious();
        },
      });
    }
    return driverRef.current!;
  }, []);

  // Load persisted state
  useEffect(() => {
    if (typeof window === "undefined") return;
    const completed = window.localStorage.getItem(LS_COMPLETED_KEY) === "true";
    const optedOut = window.localStorage.getItem(LS_OPTOUT_KEY) === "true";
    setHasCompleted(completed);
    setHasOptedOut(optedOut);
  }, []);

  // Build steps for current path
  useEffect(() => {
    const pathSteps = getStepsForPath(pathname || "/");
    setSteps(pathSteps);
  }, [pathname]);

  // Auto-start for first-time users on desktop
  useEffect(() => {
    if (!isDesktop) return;
    if (!hasCompleted && !hasOptedOut) {
      // Do not auto-run immediately to avoid layout shift; small delay
      const id = window.setTimeout(() => setRun(true), 600);
      return () => window.clearTimeout(id);
    }
  }, [hasCompleted, hasOptedOut, isDesktop]);

  // Auto-start when explicitly requested for the next route
  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldStart =
      window.localStorage.getItem(LS_START_NEXT_KEY) === "true";
    if (shouldStart) {
      // Small delay to ensure page content is ready for selectors
      const id = window.setTimeout(() => {
        const d = ensureDriver();
        d.setSteps(steps);
        d.drive();
        setRun(true);
        // Clear the flag only after starting to avoid races
        window.localStorage.removeItem(LS_START_NEXT_KEY);
      }, 600);
      return () => window.clearTimeout(id);
    }
  }, [pathname, ensureDriver, steps]);

  const startTour = useCallback(() => {
    setRun(true);
    const d = ensureDriver();
    d.setSteps(steps);
    d.drive();
  }, [ensureDriver, steps]);

  const stopTour = useCallback(() => {
    setRun(false);
    driverRef.current?.destroy();
  }, []);
  const optOut = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LS_OPTOUT_KEY, "true");
    }
    setHasOptedOut(true);
    setRun(false);
  }, []);
  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LS_COMPLETED_KEY);
      window.localStorage.removeItem(LS_OPTOUT_KEY);
    }
    setHasCompleted(false);
    setHasOptedOut(false);
    setRun(false);
  }, []);

  // Handle route changes requested by steps
  useEffect(() => {
    if (!run) return;
    if (pendingRouteRef.current) {
      const to = pendingRouteRef.current;
      pendingRouteRef.current = null;
      router.push(to);
      window.setTimeout(() => {
        const d = ensureDriver();
        d.setSteps(getStepsForPath(to));
        d.drive();
      }, 700);
    }
  }, [run, router, ensureDriver]);

  const contextValue: GuideContextValue = useMemo(
    () => ({
      run,
      startTour,
      stopTour,
      optOut,
      reset,
      hasCompleted,
      hasOptedOut,
    }),
    [run, startTour, stopTour, optOut, reset, hasCompleted, hasOptedOut]
  );

  return (
    <GuideContext.Provider value={contextValue}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error("useGuide must be used within GuideProvider");
  return ctx;
}
