import { useEffect } from "react";

export function useStepSimulation(
  enabled: boolean,
  matchEnded: boolean,
  setMySteps: (fn: (prev: number) => number) => void,
  setOpponentSteps: (fn: (prev: number) => number) => void
) {
  useEffect(() => {
    if (!enabled || matchEnded) return;

    const interval = setInterval(() => {
      setMySteps((prev) => prev + Math.floor(Math.random() * 5) + 1);
      setOpponentSteps((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [enabled, matchEnded]);
}
