"use client";

import { useState, useMemo, useEffect } from "react";
import type { Wheel as WheelType } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Wheel from "@/components/wheel";
import WheelConfigurator from "@/components/wheel-configurator";
import WheelManager from "@/components/wheel-manager";
import { generateColors } from "@/lib/colors";
import { Icons } from "@/components/icons";

const DEFAULT_WHEELS: WheelType[] = [
  {
    id: crypto.randomUUID(),
    name: "Default Decision Wheel",
    sections: [
      { id: crypto.randomUUID(), value: "Yes" },
      { id: crypto.randomUUID(), value: "No" },
      { id: crypto.randomUUID(), value: "Maybe" },
      { id: crypto.randomUUID(), value: "Ask Again Later" },
      { id: crypto.randomUUID(), value: "Definitely!" },
      { id: crypto.randomUUID(), value: "Not a chance" },
    ],
    colors: generateColors(6),
    history: [],
  },
];

export default function Home() {
  const [wheels, setWheels] = useLocalStorage<WheelType[]>("spin-sync-wheels", DEFAULT_WHEELS);
  const [activeWheelId, setActiveWheelId] = useLocalStorage<string | null>(
    "spin-sync-active-wheel",
    wheels[0]?.id ?? null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!activeWheelId && wheels.length > 0) {
      setActiveWheelId(wheels[0].id);
    }
  }, [wheels, activeWheelId, setActiveWheelId]);

  const activeWheel = useMemo(
    () => wheels.find((w) => w.id === activeWheelId) || wheels[0] || null,
    [wheels, activeWheelId]
  );

  const handleUpdateWheel = (updatedWheel: WheelType) => {
    setWheels((prevWheels) =>
      prevWheels.map((w) => (w.id === updatedWheel.id ? updatedWheel : w))
    );
  };

  const handleAddWheel = (name: string) => {
    const newWheel: WheelType = {
      id: crypto.randomUUID(),
      name,
      sections: [
        { id: crypto.randomUUID(), value: "Option 1" },
        { id: crypto.randomUUID(), value: "Option 2" },
      ],
      colors: generateColors(2),
      history: [],
    };
    setWheels((prev) => [...prev, newWheel]);
    setActiveWheelId(newWheel.id);
  };

  const handleDeleteWheel = (id: string) => {
    setWheels((prev) => prev.filter((w) => w.id !== id));
    if (activeWheelId === id) {
      const remainingWheels = wheels.filter((w) => w.id !== id);
      setActiveWheelId(remainingWheels.length > 0 ? remainingWheels[0].id : null);
    }
  };

  if (!isClient) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <Icons.logo className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              SpinSync
            </h1>
          </div>
          <WheelManager
            wheels={wheels}
            activeWheelId={activeWheelId}
            onWheelSelect={setActiveWheelId}
            onAddWheel={handleAddWheel}
            onDeleteWheel={handleDeleteWheel}
          />
        </div>
      </header>

      <main className="flex-1">
        {activeWheel ? (
          <div className="container mx-auto grid flex-1 grid-cols-1 gap-8 p-4 md:grid-cols-5 md:p-6 lg:grid-cols-3">
            <div className="md:col-span-3 lg:col-span-2">
              <Wheel key={activeWheel.id} wheel={activeWheel} onSpinEnd={handleUpdateWheel} />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <WheelConfigurator
                key={activeWheel.id}
                wheel={activeWheel}
                onWheelChange={handleUpdateWheel}
              />
            </div>
          </div>
        ) : (
          <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-8 text-center">
            <h2 className="text-2xl font-bold">No Wheels Found</h2>
            <p className="text-muted-foreground">
              Create your first wheel to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
