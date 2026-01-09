import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId } = route.params as { matchId: string };

  const [match, setMatch] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🏁 [ResultsScreen] Mounted with matchId:", matchId);

    const load = async () => {
      setLoading(true);

      // 1️⃣ Fetch match row
      console.log("📨 [ResultsScreen] Fetching match...");
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single();

      if (matchError) {
        console.log("❌ [ResultsScreen] Error fetching match:", matchError);
        setLoading(false);
        return;
      }

      console.log("📊 [ResultsScreen] Match:", matchData);
      setMatch(matchData);

      // 2️⃣ Fetch match participants
      console.log("📨 [ResultsScreen] Fetching match participants...");
      const { data: participantData, error: participantError } = await supabase
        .from("match_participants")
        .select("*")
        .eq("match_id", matchId);

      if (participantError) {
        console.log(
          "❌ [ResultsScreen] Error fetching participants:",
          participantError
        );
        setLoading(false);
        return;
      }

      console.log("👥 [ResultsScreen] Participants:", participantData);
      setParticipants(participantData);

      setLoading(false);
    };

    load();
  }, [matchId]);

  if (loading || !match) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading results…</Text>
      </View>
    );
  }

  // Extract participant steps
  const p1 = participants.find((p) => p.user_id === match.player1_id);
  const p2 = participants.find((p) => p.user_id === match.player2_id);

  const player1Steps = p1?.final_steps ?? match.player1_steps ?? 0;
  const player2Steps = p2?.final_steps ?? match.player2_steps ?? 0;

  // Determine result text
  let resultText = "Draw!";
  if (match.winner_user_id === match.player1_id) resultText = "Player 1 Wins!";
  if (match.winner_user_id === match.player2_id) resultText = "Player 2 Wins!";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Results</Text>
      <Text style={styles.result}>{resultText}</Text>

      <View style={styles.stepsBox}>
        <Text style={styles.stepsText}>Player 1: {player1Steps} steps</Text>
        <Text style={styles.stepsText}>Player 2: {player2Steps} steps</Text>
      </View>

      <Button
        title="Play Again"
        onPress={() => (navigation as any).navigate("Matchmaking")}
      />

      <View style={{ height: 20 }} />

      <Button
        title="Home"
        onPress={() => (navigation as any).navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },
  result: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
    color: "#007AFF",
  },
  stepsBox: {
    marginBottom: 40,
  },
  stepsText: {
    fontSize: 22,
    marginVertical: 8,
  },
});
