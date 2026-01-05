import { supabase } from "../supabase";

export async function createUserIfNotExists(userId: string) {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (data) return data; // already exists

  const { data: newUser, error } = await supabase
    .from("users")
    .insert([{ id: userId }])
    .select()
    .single();

  if (error) throw error;
  return newUser;
}
