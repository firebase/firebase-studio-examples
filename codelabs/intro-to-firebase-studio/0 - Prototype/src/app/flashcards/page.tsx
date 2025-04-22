"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const flashcardData = [
  { french: "Bonjour", english: "Hello" },
  { french: "Au revoir", english: "Goodbye" },
  { french: "Merci", english: "Thank you" },
  { french: "S'il vous plaît", english: "Please" },
];

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardData.length);
    setIsFlipped(false); // Reset flip on next card
  };

  const handlePrevious = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? flashcardData.length - 1 : prevIndex - 1
    );
    setIsFlipped(false); // Reset flip on previous card
  };

  const currentCard = flashcardData[currentCardIndex];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64">
            <div
              className={`relative w-64 h-40 rounded-md shadow-md transition-transform duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              <div className="absolute w-full h-full flex items-center justify-center font-semibold text-lg backface-hidden">
                {currentCard.french}
              </div>
              <div className="absolute w-full h-full flex items-center justify-center font-semibold text-lg bg-secondary text-foreground rotate-y-180 backface-hidden">
                {currentCard.english}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevious}>Previous</Button>
            <Button onClick={handleFlip}>
              {isFlipped ? "Show French" : "Show English"}
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
