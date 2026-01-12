// src/sensors/useStepPermissions.ts
import { useEffect, useState } from "react";
import { Pedometer } from "expo-sensors";

type PedometerwithPermissions = typeof Pedometer & {
    requestPermissionAsync?: () => Promise<{ status: string }>;
    getPermissionsAsync?: () => Promise<{ status: string }>;
};

const PedometerTyped = Pedometer as PedometerwithPermissions;


export function useStepPermissions() {
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
        if (!PedometerTyped.getPermissionsAsync) {
            console.log(" requestPemissionAsync not available on this platform");
            setGranted(true);
            return;
        }
        const { status } = await PedometerTyped.getPermissionsAsync();
        setGranted(status === "granted");
    };
    
    check();
  }, []);

  return granted;
}