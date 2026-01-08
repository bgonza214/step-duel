import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function MatchmakingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    console.log("🔍 [MatchmakingScreen] Mounted");

    let subscription: any;

    const run = async () => {
      console.log("🔍 [MatchmakingScreen] Starting setup...");

      // 1️⃣ Get user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.log("❌ [MatchmakingScreen] Session error:", sessionError);
        return;
      }

      const user = session?.user;
      if (!user) {
        console.log("❌ [MatchmakingScreen] No user found");
        return;
      }

      console.log("👤 [MatchmakingScreen] User ID:", user.id);

      // 2️⃣ Subscribe to ALL match INSERT events (filter in JS)
      console.log(
        "📡 [MatchmakingScreen] Subscribing to match INSERT events..."
      );

      subscription = supabase
        .channel(`match-listener-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "matches",
          },
          (payload) => {
            const match = payload.new;
            console.log("🔥 [MatchmakingScreen] Match INSERT detected:", match);

            // Filter manually
            if (match.player1_id === user.id || match.player2_id === user.id) {
              console.log(
                "➡️ [MatchmakingScreen] Navigating to MatchFound with matchId:",
                match.id
              );
              (navigation as any).navigate("MatchFound", { matchId: match.id });
            } else {
              console.log("ℹ️ [MatchmakingScreen] INSERT not for this user");
            }
          }
        )
        .subscribe((status) => {
          console.log("📡 [MatchmakingScreen] Subscription status:", status);
        });

      // 3️⃣ Call the matchmaker Edge Function
      console.log("📨 [MatchmakingScreen] Calling Edge Function: find-match");

      const { data, error } = await supabase.functions.invoke("find-match", {
        body: { user_id: user.id },
      });

      if (error) {
        console.log("⚠️ [MatchmakingScreen] Edge Function error:", error);
      } else {
        console.log("📬 [MatchmakingScreen] Edge Function response:", data);
      }

      // 4️⃣ Fallback SELECT (late subscriber)
      console.log(
        "⏱ [MatchmakingScreen] Checking for existing match (fallback)..."
      );

      const { data: existingMatch, error: selectError } = await supabase
        .from("matches")
        .select("*")
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (selectError) {
        console.log(
          "⚠️ [MatchmakingScreen] Fallback SELECT error:",
          selectError
        );
      }

      if (existingMatch) {
        console.log(
          "🎯 [MatchmakingScreen] Existing match found:",
          existingMatch
        );

        console.log(
          "➡️ [MatchmakingScreen] Navigating to MatchFound with matchId:",
          existingMatch.id
        );

        (navigation as any).navigate("MatchFound", {
          matchId: existingMatch.id,
        });
      } else {
        console.log("⌛ [MatchmakingScreen] No existing match found yet");
      }
    };

    run();

    return () => {
      console.log("🧹 [MatchmakingScreen] Cleaning up subscription...");
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finding Opponent…</Text>
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={{ marginTop: 20 }}
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
