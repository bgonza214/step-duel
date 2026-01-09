import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function MatchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId } = route.params as { matchId: string };

  const [match, setMatch] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log("🎮 [MatchScreen] Mounted with matchId:", matchId);

    let subscription: any;

    const load = async () => {
      // 1️⃣ Fetch session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.log("❌ [MatchScreen] No user session found");
        return;
      }

      setUser(session.user);
      console.log("👤 [MatchScreen] User ID:", session.user.id);

      // 2️⃣ Fetch match row
      console.log("📨 [MatchScreen] Fetching match row...");
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single();

      if (error) {
        console.log("❌ [MatchScreen] Error fetching match:", error);
        return;
      }

      console.log("📊 [MatchScreen] Match data:", data);
      setMatch(data);

      // 3️⃣ Subscribe to realtime match updates
      console.log("📡 [MatchScreen] Subscribing to match updates...");

      subscription = supabase
        .channel(`match-updates-${matchId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "matches",
            filter: `id=eq.${matchId}`,
          },
          (payload) => {
            const updated = payload.new;
            console.log("🔥 [MatchScreen] Realtime match update:", updated);

            if (updated.status === "completed") {
              console.log(
                "➡️ [MatchScreen] Match completed — navigating to Results"
              );
              (navigation as any).navigate("Results", { matchId });
            }
          }
        )
        .subscribe((status) => {
          console.log("📡 [MatchScreen] Subscription status:", status);
        });
    };

    load();

    return () => {
      console.log("🧹 [MatchScreen] Cleaning up subscription...");
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [matchId]);

  const endMatch = async () => {
    console.log("🛑 [MatchScreen] Ending match...");

    if (!match || !user) {
      console.log("❌ [MatchScreen] Missing match or user");
      return;
    }

    // For now: both players have 0 steps
    const player1Steps = 0;
    const player2Steps = 0;

    // Draw for now
    const winner = null;

    // 1️⃣ Update matches table
    const { error: matchError } = await supabase
      .from("matches")
      .update({
        status: "completed",
        winner_user_id: winner,
        player1_steps: player1Steps,
        player2_steps: player2Steps,
        ended_at: new Date().toISOString(),
      })
      .eq("id", matchId);

    if (matchError) {
      console.log("❌ [MatchScreen] Error updating match:", matchError);
      return;
    }

    console.log("✅ [MatchScreen] Match table updated");

    // 2️⃣ Update match_participants table
    console.log("📨 [MatchScreen] Updating match_participants...");

    const updates = [
      {
        match_id: matchId,
        user_id: match.player1_id,
        final_steps: player1Steps,
      },
      {
        match_id: matchId,
        user_id: match.player2_id,
        final_steps: player2Steps,
      },
    ];

    for (const row of updates) {
      const { error } = await supabase
        .from("match_participants")
        .upsert(row, { onConflict: "match_id,user_id" });

      if (error) {
        console.log("❌ [MatchScreen] Error updating participant:", error);
      } else {
        console.log("✅ [MatchScreen] Participant updated:", row);
      }
    }

    // 3️⃣ (Optional) Update user stats — keep commented until RPC is ready
    /*
    const { error: statsError } = await supabase.rpc("update_user_stats", {
      user_id_input: user.id,
      result: "draw",
      steps: 0,
    });

    if (statsError) {
      console.log("⚠️ [MatchScreen] Error updating user stats:", statsError);
    } else {
      console.log("✅ [MatchScreen] User stats updated");
    }
    */

    // 4️⃣ Navigate to ResultsScreen (other player will follow via realtime)
    console.log("➡️ [MatchScreen] Navigating to ResultsScreen...");
    (navigation as any).navigate("Results", { matchId });
  };

  if (!match) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading match…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Started!</Text>

      <View style={styles.stepsBox}>
        <Text style={styles.stepsText}>Player 1: 0 steps</Text>
        <Text style={styles.stepsText}>Player 2: 0 steps</Text>
      </View>

      <Button title="End Match" onPress={endMatch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  stepsBox: {
    marginBottom: 40,
  },
  stepsText: {
    fontSize: 22,
    marginVertical: 8,
  },
});
