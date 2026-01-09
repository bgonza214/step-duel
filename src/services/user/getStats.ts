// src/services/user/getStats.ts
import { supabase } from "../../lib/supabase";

export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("wins, losses, draws")
    .eq("id", userId)
    .single();

  if (error) {
    console.log("❌ [getUserStats] Error fetching stats:", error);
    throw error;
  }

  return {
    wins: data?.wins ?? 0,
    losses: data?.losses ?? 0,
    draws: data?.draws ?? 0,
  };
}