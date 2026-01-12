import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";

export function useLiveSteps() {
  const [isAvailable, setIsAvailable] = useState<"checking" | "yes" | "no">("checking");
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription: any;

    const start = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available ? "yes" : "no");

      if (!available) return;

      subscription = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
      });
    };

    start();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return { isAvailable, steps };
}