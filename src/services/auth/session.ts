// src/services/auth/session.ts
import { supabase } from "../../lib/supabase";

export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.log("❌ [getCurrentUser] Session error:", error);
    throw error;
  }

  return session?.user ?? null;
}