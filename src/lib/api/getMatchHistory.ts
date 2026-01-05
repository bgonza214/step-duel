import { supabase } from "../supabase";

export async function getMatchHistory(userId: string) {
  const { data, error } = await supabase
    .from("match_participants")
    .select(
      `
      final_steps,
      match:matches (
        id,
        target_steps,
        started_at,
        ended_at,
        winner_user_id
      )
    `
    )
    .eq("user_id", userId)
    .order("started_at", { foreignTable: "matches", ascending: false });

  if (error) throw error;
  return data;
}
