import { supabase } from "../supabase";

export async function setWinner(matchId: string, winnerUserId: string | null) {
  const { data, error } = await supabase
    .from("matches")
    .update({
      winner_user_id: winnerUserId,
      ended_at: new Date().toISOString(),
    })
    .eq("id", matchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
