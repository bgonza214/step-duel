import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

import { supabase } from "./src/lib/supabase";
import { createUserIfNotExists } from "./src/lib/api/createUserIfNotExists";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("🔵 Starting init...");

        // 1. Check existing session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        console.log("🟣 Session data:", sessionData);
        if (sessionError) console.log("🔴 Session error:", sessionError);

        let userId: string;

        // 2. If no session → sign in anonymously
        if (!sessionData.session) {
          console.log("🟡 No session found. Signing in anonymously...");

          const { data: signInData, error: signInError } =
            await supabase.auth.signInAnonymously();

          console.log("🟠 Sign-in result:", signInData);
          if (signInError) {
            console.log("🔴 Sign-in error:", signInError);
            throw signInError;
          }

          if (!signInData.user) {
            console.log("🔴 ERROR: signInData.user is null");
            throw new Error("Anonymous sign-in returned no user");
          }

          userId = signInData.user.id;
          console.log("🟢 Anonymous user ID:", userId);
        } else {
          // 3. Existing session
          userId = sessionData.session.user.id;
          console.log("🟢 Existing session user ID:", userId);
        }

        // 4. Ensure user exists in your custom table
        console.log("🔵 Creating user if not exists...");
        await createUserIfNotExists(userId);
        console.log("🟢 User ensured in database");

        // 5. App is ready
        console.log("✅ Init complete!");
        setIsReady(true);
      } catch (err) {
        console.log("🔥 FATAL INIT ERROR:", err);
      }
    };

    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator />;
}
