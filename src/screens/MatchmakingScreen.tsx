import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function MatchmakingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Matchmaking delay
    const timer = setTimeout(() => {
      navigation.navigate("Match" as never);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finding Opponent ...</Text>

      <ActivityIndicator
        size="large"
        color="#007AF"
        style={{ marginTop: 20 }}
      />

      <Text style={styles.subtitle}>Searching for a player to duel</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
});
