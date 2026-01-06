import { supabase } from "../supabase";

export async function joinQueue(userId: string) {
  const { data, error } = await supabase
    .from("match_queue")
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
