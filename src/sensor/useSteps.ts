import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";

export function useSteps() {
  const [isAvailable, setIsAvailable] = useState<"checking" | "yes" | "no">("checking");
  const [todaySteps, setTodaySteps] = useState(0);

  useEffect(() => {
    const loadTodaySteps = async () => {
      // 1️⃣ Check hardware availability
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available ? "yes" : "no");

      if (!available) {
        console.log("❌ Step counter not available on this device");
        return;
      }

      // 2️⃣ Calculate midnight → now
      const now = new Date();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // midnight

      // 3️⃣ Get steps since midnight
      const result = await Pedometer.getStepCountAsync(startOfDay, now);
      if (result) {
        setTodaySteps(result.steps);
      }
    };

    loadTodaySteps();
  }, []);

  return {
    isAvailable,
    todaySteps,
  };
}