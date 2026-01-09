// src/services/matchmaking/findMatch.ts
import { getCurrentUser } from "../auth/session";
import { enqueueUser } from "./queue";

export async function handleFindMatch(navigation: any) {
  console.log("🎯 [findMatch] Starting matchmaking...");

  // 1️⃣ Get current user
  const user = await getCurrentUser();
  if (!user) {
    console.log("❌ [findMatch] No user found");
    return;
  }

  // 2️⃣ Insert into match_queue
  await enqueueUser(user.id);

  // 3️⃣ Navigate to matchmaking screen
  navigation.navigate("Matchmaking");
}