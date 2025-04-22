"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageContext } from "@/components/language-context";

const frenchFlashcardData = [
  { english: "Hello", french: "Bonjour" },
  { english: "Goodbye", french: "Au revoir" },
  { english: "Thank you", french: "Merci" },
  { english: "Please", french: "S'il vous plaît" },
  { english: "The cat", french: "Le chat" },
  { english: "The house", french: "La maison" },
  { english: "The book", french: "Le livre" },
  { english: "The school", french: "L'école" },
];

const japaneseFlashcardData = [
  { english: "Hello", japanese: "こんにちは (Konnichiwa)" },
  { english: "Goodbye", japanese: "さようなら (Sayounara)" },
  { english: "Thank you", japanese: "ありがとう (Arigatou)" },
  { english: "Please", japanese: "お願いします (Onegaishimasu)" },
  { english: "The cat", japanese: "猫 (Neko)" },
  { english: "The house", japanese: "家 (Ie)" },
  { english: "The book", japanese: "本 (Hon)" },
  { english: "The school", japanese: "学校 (Gakkou)" },
];

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { language } = useContext(LanguageContext);

  const getFlashcardData = () => {
    switch (language) {
      case "french":
        return frenchFlashcardData;
      case "japanese":
        return japaneseFlashcardData;
      default:
        return frenchFlashcardData;
    }
  };

  const flashcardData = getFlashcardData();
  const [currentCard, setCurrentCard] = useState(flashcardData[0]);

  useEffect(() => {
    if (flashcardData.length > 0) {
      setCurrentCard(flashcardData[currentCardIndex]);
    }
  }, [currentCardIndex, language, flashcardData]);


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

  const getFrontText = () => {
    if (!currentCard) return "";
    
    switch (language) {
      case "french":
        return currentCard.french;
      case "japanese":
        return currentCard.japanese;
      default:
        return currentCard.french;
    }
  };

  const getBackText = () => {
    if (!currentCard) return "";

    return currentCard.english;
  };


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
                {isFlipped ? getFrontText() : getBackText()}
              </div>
              <div className="absolute w-full h-full flex items-center justify-center font-semibold text-lg bg-secondary text-foreground rotate-y-180 backface-hidden">
                {isFlipped ? getBackText() : getFrontText()}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={handleFlip}>Flip</Button>
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevious}>Previous</Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

