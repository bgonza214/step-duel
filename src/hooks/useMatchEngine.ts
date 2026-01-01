import { useEffect, useState } from "react";
import { getMatchResult } from "../utils/getMatchResults";
import { useStepSimulation } from "./useStepSimulation";

export function useMatchEngine(
  targetSteps: number,
  onMatchEnd: (result: {
    mySteps: number;
    opponentSteps: number;
    result: "win" | "lose" | "draw";
  }) => void
) {
  const [mySteps, setMySteps] = useState(0);
  const [opponentSteps, setOpponentSteps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [matchEnded, setMatchEnded] = useState(false);

  // ⭐ Step Simulation (temporary, isolated)
  useStepSimulation(true, matchEnded, setMySteps, setOpponentSteps);

  // ⭐ Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ⭐ Referee
  useEffect(() => {
    if (matchEnded) return;

    const someoneReachedTarget =
      mySteps >= targetSteps || opponentSteps >= targetSteps;

    const timeIsUp = timeLeft === 0;

    if (!someoneReachedTarget && !timeIsUp) return;

    setMatchEnded(true);

    const result = getMatchResult(mySteps, opponentSteps, targetSteps);

    onMatchEnd({
      mySteps,
      opponentSteps,
      result,
    });
  }, [timeLeft, mySteps, opponentSteps, matchEnded]);

  return {
    mySteps,
    opponentSteps,
    timeLeft,
    matchEnded,
    myProgress: (mySteps / targetSteps) * 100,
    opponentProgress: (opponentSteps / targetSteps) * 100,
  };
}
