import { View, Text, StyleSheet } from "react-native";
import { useLiveSteps } from "../sensor/useLiveSteps";

export default function LiveStepsDisplay() {
  const { isAvailable, steps } = useLiveSteps();

  if (isAvailable === "checking") {
    return <Text style={styles.label}>Loading steps...</Text>;
  }

  if (isAvailable === "no") {
    return <Text style={styles.error}>Live step tracking not supported</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Steps</Text>
      <Text style={styles.steps}>{steps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 20 },
  label: { fontSize: 16, color: "#555" },
  steps: { fontSize: 32, fontWeight: "700" },
  error: { color: "red", fontSize: 16 },
});
