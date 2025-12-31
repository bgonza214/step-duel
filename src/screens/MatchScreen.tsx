import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function MatchScreen() {
  const navigation = useNavigation();
  const TARGET_STEPS = 100;

  // Hardcode steps for now
  const mySteps = 1;
  const opponentSteps = 72;

  // Progress Bar
  const myProgress = (mySteps / TARGET_STEPS) * 100;
  const opponentProgress = (opponentSteps / TARGET_STEPS) * 100;

  //End match logic
  const endMatch = () => {
    const result =
      mySteps > opponentSteps
        ? "win"
        : mySteps < opponentSteps
        ? "lose"
        : "draw";

    (navigation as any).navigate("Results", {
      mySteps,
      opponentSteps,
      result,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match In Progress</Text>

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
      {/* Temporary button to end match */}
      <TouchableOpacity style={styles.button} onPress={endMatch}>
        <Text style={styles.buttonText}>End Match</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
