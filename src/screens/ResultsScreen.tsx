import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Read Data Passed
  const { mySteps, opponentSteps, result } = route.params as {
    mySteps: number;
    opponentSteps: number;
    result: "win" | "lose" | "draw";
  };

  const getTitle = () => {
    if (result === "win") return "You Win!";
    if (result === "lose") return "You Lose!";
    return "It's a Draw!";
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>

      <View style={styles.resultsBox}>
        <Text style={styles.label}>Your Steps</Text>
        <Text style={styles.value}>{mySteps}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Opponent Steps</Text>
        <Text style={styles.value}>{opponentSteps}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => (navigation as any).navigate("Matchmaking")}
      >
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.homeButton]}
        onPress={() => (navigation as any).navigate("Home")}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
  },
  resultsBox: {
    width: "80%",
    padding: 24,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    color: "#555",
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 16,
  },
  homeButton: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
