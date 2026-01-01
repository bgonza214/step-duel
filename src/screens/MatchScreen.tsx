import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getMatchResult } from "../utils/getMatchResults";

export default function MatchScreen() {
  const navigation = useNavigation();

  //Simulate steps
  const [mySteps, setMySteps] = useState(0);
  const [opponentSteps, setOpponentSteps] = useState(0);

  //Target Steps
  const TARGET_STEPS = 100;

  const [timeLeft, setTimeLeft] = useState(100);
  const [matchEnded, setMatchEnded] = useState(false);

  const myProgress = (mySteps / TARGET_STEPS) * 100;
  const opponentProgress = (opponentSteps / TARGET_STEPS) * 100;

  useEffect(() => {
    if (matchEnded) return;

    const interval = setInterval(() => {
      setMySteps((prev) => prev + Math.floor(Math.random() * 5) + 1);
      setOpponentSteps((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [matchEnded]);

  // 1) Timer: ONLY updates timeLeft, never navigates
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Let it hit 0, referee effect will handle ending
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2) Single referee: decides when the match ends and navigates
  useEffect(() => {
    if (matchEnded) return;

    const someoneReachedTarget =
      mySteps >= TARGET_STEPS || opponentSteps >= TARGET_STEPS;

    const timeIsUp = timeLeft === 0;

    if (!someoneReachedTarget && !timeIsUp) {
      return;
    }

    // Mark match as ended so nothing else can trigger it again
    setMatchEnded(true);

    const result = getMatchResult(mySteps, opponentSteps, TARGET_STEPS);
    // Single navigation point
    (navigation as any).navigate("Results", {
      mySteps,
      opponentSteps,
      result,
    });
  }, [timeLeft, mySteps, opponentSteps, matchEnded, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match In Progress</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      <View style={styles.playerSection}>
        <Text style={styles.label}>You</Text>
        <Text style={styles.steps}>{mySteps} steps</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${myProgress}%` }]} />
        </View>
      </View>

      <View style={styles.playerSection}>
        <Text style={styles.label}>Opponent</Text>
        <Text style={styles.steps}>{opponentSteps} steps</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFillOpponent,
              { width: `${opponentProgress}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  timer: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
  },
  playerSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
  },
  steps: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 8,
  },
  progressBar: {
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  progressFillOpponent: {
    height: "100%",
    backgroundColor: "#FF3B30",
  },
});
