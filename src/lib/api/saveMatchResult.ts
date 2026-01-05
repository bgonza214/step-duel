import { supabase } from "../supabase";

export async function saveMatchResult(
  matchId: string,
  userId: string,
  finalSteps: number
) {
  const { data, error } = await supabase
    .from("match_participants")
    .update({ final_steps: finalSteps })
    .eq("match_id", matchId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
