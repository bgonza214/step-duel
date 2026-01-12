import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import StepsDisplay from "../components/StepsDisplay"; // 👈 TEMPORARY for testing
import { getCurrentUser } from "../services/auth/session";
import { getUserStats } from "../services/user/getStats";
import { handleFindMatch } from "../services/matchmaking/findMatch";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    console.log("📊 [HomeScreen] Loading user stats...");

    const user = await getCurrentUser();
    if (!user) {
      console.log("❌ [HomeScreen] No user found");
      setLoading(false);
      return;
    }

    const userStats = await getUserStats(user.id);
    setStats(userStats);

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Duel</Text>

      {/* TEMPORARY: Live step tracking for testing */}
      <StepsDisplay />

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.losses}</Text>
          <Text style={styles.statLabel}>Losses</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.draws}</Text>
          <Text style={styles.statLabel}>Draws</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleFindMatch(navigation)}
      >
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
