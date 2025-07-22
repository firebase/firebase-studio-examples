"use client";

import { useState, useMemo } from "react";
import type { Wheel as WheelType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

interface WheelProps {
  wheel: WheelType;
  onSpinEnd: (updatedWheel: WheelType) => void;
}

const Wheel = ({ wheel, onSpinEnd }: WheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { sections, colors } = wheel;
  const numSections = sections.length;
  const sectionAngle = 360 / numSections;

  const conicGradient = useMemo(() => {
    if (numSections === 0) return "transparent";
    const colorStops = colors
      .map(
        (color, i) =>
          `${color} ${i * sectionAngle}deg ${(i + 1) * sectionAngle}deg`
      )
      .join(", ");
    return `conic-gradient(${colorStops})`;
  }, [colors, numSections, sectionAngle]);

  const handleSpin = () => {
    if (isSpinning || numSections < 1) return;

    setIsSpinning(true);
    setResult(null);

    const randomSpins = Math.floor(Math.random() * 5) + 5; // 5 to 9 full spins
    const randomStop = Math.floor(Math.random() * 360);
    const newRotation = rotation + randomSpins * 360 + randomStop;

    setRotation(newRotation);
  };

  const onTransitionEnd = () => {
    const actualRotation = rotation % 360;
    const winningIndex = Math.floor((360 - actualRotation + sectionAngle / 2) / sectionAngle) % numSections;
    const winningSection = sections[winningIndex];

    if (winningSection) {
      setTimeout(() => {
        setResult(winningSection.value);
        const updatedWheel = {
          ...wheel,
          history: [winningSection.value, ...wheel.history.slice(0, 4)],
        };
        onSpinEnd(updatedWheel);
      }, 500); // Delay showing the result for suspense
    } else {
      setIsSpinning(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 p-4 md:p-6">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute text-primary"
          style={{ top: "-30px", zIndex: 10 }}
        >
          <ArrowDown size={40} className="drop-shadow-md" />
        </div>

        <div
          className={cn(
            "relative h-64 w-64 rounded-full border-8 border-background shadow-2xl transition-transform duration-[5000ms] ease-in-out md:h-96 md:w-96 lg:h-[500px] lg:w-[500px]",
            { "cursor-not-allowed opacity-50": numSections < 2 }
          )}
          style={{
            background: conicGradient,
            transform: `rotate(${rotation}deg)`,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {sections.map((section, i) => {
            const angle = i * sectionAngle + sectionAngle / 2;
            return (
              <div
                key={section.id}
                className="pointer-events-none absolute inset-0 origin-center flex justify-center items-start"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <span
                  className="select-none font-bold text-white mt-12"
                  style={{
                    display: 'inline-block',
                    transform: 'rotate(-90deg)',
                    textShadow: '0 0 5px rgba(0,0,0,0.7)',
                    maxWidth: '40%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {section.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Button
        size="lg"
        onClick={handleSpin}
        disabled={isSpinning || numSections < 2}
        className="w-48 rounded-full py-6 text-xl font-bold uppercase tracking-wider shadow-lg"
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </Button>
      
      <AlertDialog
        open={!!result}
        onOpenChange={(open) => {
          if (!open) {
            setResult(null);
            setIsSpinning(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold">
              The winner is:
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-center text-4xl font-bold text-primary">
              {result}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full">
              Awesome!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wheel;
