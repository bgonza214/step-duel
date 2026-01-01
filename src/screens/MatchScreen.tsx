import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMatchEngine } from "../hooks/useMatchEngine";

export default function MatchScreen() {
  const navigation = useNavigation();

  const TARGET_STEPS = 100;

  // Use the match engine
  const { mySteps, opponentSteps, timeLeft, myProgress, opponentProgress } =
    useMatchEngine(TARGET_STEPS, ({ mySteps, opponentSteps, result }) => {
      // Navigate to results when match ends
      (navigation as any).navigate("Results", {
        mySteps,
        opponentSteps,
        result,
      });
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match In Progress</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      {/* Player Section */}
      <View style={styles.playerSection}>
        <Text style={styles.label}>You</Text>
        <Text style={styles.steps}>{mySteps} steps</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${myProgress}%` }]} />
        </View>
      </View>

      {/* Opponent Section */}
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
