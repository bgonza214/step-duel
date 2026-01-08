import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleFindMatch = async () => {
    // 1. Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      console.log("No user found");
      return;
    }

    // 2. Insert into match_queue
    await supabase.from("match_queue").insert([{ user_id: user.id }]);

    // 3. Navigate to matchmaking screen
    navigation.navigate("Matchmaking" as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Duel</Text>
      <Text style={styles.steps}>3,482 steps today</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Losses</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Draws</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFindMatch}>
        <Text style={styles.buttonText}>Find Match</Text>
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
  steps: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 40,
  },
  statCard: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
