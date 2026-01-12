import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useSteps } from "../sensor/useSteps";

export default function StepsDisplay() {
  const { isAvailable, todaySteps } = useSteps();

  if (isAvailable === "checking") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  if (isAvailable === "no") {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>
          Step tracking not supported on this device
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Today's steps:</Text>
      <Text style={styles.steps}>{todaySteps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  steps: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
