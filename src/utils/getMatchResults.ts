export function getMatchResult(mySteps: number, opponentSteps: number, target: number) {
  // Both reached or exceeded target
  if (mySteps >= target && opponentSteps >= target) {
    if (mySteps === opponentSteps) return "draw";
    return mySteps > opponentSteps ? "win" : "lose";
  }

  // Only you reached target
  if (mySteps >= target) return "win";

  // Only opponent reached target
  if (opponentSteps >= target) return "lose";

  // Time ran out — compare steps
  if (mySteps > opponentSteps) return "win";
  if (mySteps < opponentSteps) return "lose";

  return "draw";
}