import { supabase } from "../supabase";

export async function createMatch(targetSteps: number) {
  const { data, error } = await supabase
    .from("matches")
    .insert([{ target_steps: targetSteps }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
