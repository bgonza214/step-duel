import { supabase } from "../supabase";

export async function addParticipant(matchId: string, userId: string) {
  const { data, error } = await supabase
    .from("match_participants")
    .insert([{ match_id: matchId, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
