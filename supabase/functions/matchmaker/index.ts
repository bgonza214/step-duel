import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const payload = await req.json();
  const newPlayer = payload.record.user_id;

  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  // 1. Get all players in the queue ordered by time
  const { data: queue } = await supabase
    .from("match_queue")
    .select("*")
    .order("inserted_at", { ascending: true });

  if (!queue || queue.length < 2) {
    return new Response("Not enough players", { status: 200 });
  }

  // 2. Pick the first two players
  const p1 = queue[0].user_id;
  const p2 = queue[1].user_id;

  // 3. Create a match
  const { error: matchError } = await supabase
    .from("matches")
    .insert([
      {
        player1_id: p1,
        player2_id: p2,
        status: "waiting",
        target_steps: 1000
      }
    ]);

  if (matchError) {
    console.error(matchError);
    return new Response("Match creation failed", { status: 500 });
  }

  // 4. Remove both players from the queue
  await supabase
    .from("match_queue")
    .delete()
    .in("user_id", [p1, p2]);

  return new Response("Match created", { status: 200 });
});