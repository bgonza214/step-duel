import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function MatchFoundScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId } = route.params as { matchId: string };

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    console.log("📡 [MatchFound] Mounted with matchId:", matchId);

    let interval: any;
    let subscription: any;

    const navigateToMatch = () => {
      if (hasNavigated) return;
      setHasNavigated(true);
      console.log("➡️ [MatchFound] Navigating to Match screen");
      (navigation as any).navigate("Match", { matchId });
    };

    const startCountdownLoop = (serverStartTime: number) => {
      console.log(
        "⏳ [MatchFound] Starting countdown toward:",
        serverStartTime
      );
      setStartAt(serverStartTime);

      interval = setInterval(() => {
        const now = Date.now();
        const diff = serverStartTime - now;

        if (diff <= 0) {
          clearInterval(interval);
          navigateToMatch();
          return;
        }

        setTimeLeft(diff / 1000);
      }, 100);
    };

    const setup = async () => {
      console.log("🔍 [MatchFound] Fetching session...");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) {
        console.log("❌ [MatchFound] No user found");
        return;
      }

      console.log("👤 [MatchFound] User ID:", user.id);

      // 1️⃣ Fetch match state
      console.log("📨 [MatchFound] Fetching match row...");
      const { data: match, error: matchError } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single();

      if (matchError || !match) {
        console.log("❌ [MatchFound] Match fetch error:", matchError);
        return;
      }

      console.log("📊 [MatchFound] Initial match state:", match);

      const isPlayer1 = match.player1_id === user.id;
      const readyField = isPlayer1 ? "player1_ready" : "player2_ready";

      // 2️⃣ Subscribe to realtime updates BEFORE marking ready
      console.log("📡 [MatchFound] Subscribing to realtime match updates...");
      subscription = supabase
        .channel(`match-sync-${matchId}`)
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
            console.log("🔥 [MatchFound] Realtime update:", updated);

            if (updated.status === "ready" && updated.start_at) {
              const serverStart = new Date(updated.start_at).getTime();
              startCountdownLoop(serverStart);
            }
          }
        )
        .subscribe((status) => {
          console.log("📡 [MatchFound] Subscription status:", status);
        });

      // 3️⃣ Mark this player as ready
      console.log(`📨 [MatchFound] Marking ${readyField} = true`);
      const { error: readyError } = await supabase
        .from("matches")
        .update({ [readyField]: true })
        .eq("id", matchId);

      if (readyError) {
        console.log("⚠️ [MatchFound] Ready update error:", readyError);
      } else {
        console.log("✅ [MatchFound] Ready flag updated");
      }

      // 4️⃣ Late subscriber handling
      if (match.status === "ready" && match.start_at) {
        console.log("⏱ [MatchFound] Late subscriber — match already ready");
        const serverStart = new Date(match.start_at).getTime();
        startCountdownLoop(serverStart);
      }
    };

    setup();

    return () => {
      console.log("🧹 [MatchFound] Cleaning up...");
      if (subscription) supabase.removeChannel(subscription);
      if (interval) clearInterval(interval);
    };
  }, [matchId]);

  // UI
  let displayText = "Preparing match…";
  if (timeLeft !== null) {
    if (timeLeft <= 3) {
      displayText = Math.ceil(timeLeft).toString();
    } else {
      displayText = "Get Ready…";
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{displayText}</Text>
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
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 18,
    color: "#555",
  },
  countdown: {
    marginTop: 20,
    fontSize: 72,
    fontWeight: "800",
    color: "#007AFF",
  },
});
