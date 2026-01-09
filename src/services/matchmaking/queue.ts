// src/services/matchmaking/queue.ts
import { supabase } from "../../lib/supabase";

export async function enqueueUser(userId: string) {
  const { error } = await supabase
    .from("match_queue")
    .insert([{ user_id: userId }]);

  if (error) {
    console.log("❌ [enqueueUser] Error inserting into match_queue:", error);
    throw error;
  }

  console.log("📥 [enqueueUser] User added to match_queue:", userId);
}