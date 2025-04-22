"use client";

import { useState, useEffect } from "react";
import { generateFrenchStory } from "@/ai/flows/generate-french-story";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Comprehensive dictionary with more definitions
const frenchDictionary: { [key: string]: string } = {
  "le chat": "the cat (noun)",
  "la maison": "the house (noun)",
  "bonjour": "hello (greeting)",
  "au revoir": "goodbye (farewell)",
  "merci": "thank you (expression of gratitude)",
  "s'il vous plaît": "please (polite request)",
  "oui": "yes (affirmative response)",
  "non": "no (negative response)",
  "être": "to be (verb)",
  "avoir": "to have (verb)",
  "faire": "to do, to make (verb)",
  "aller": "to go (verb)",
  "venir": "to come (verb)",
  "vouloir": "to want (verb)",
  "pouvoir": "to be able to (verb)",
  "devoir": "to have to, must (verb)",
  "savoir": "to know (verb)",
  "comprendre": "to understand (verb)",
  "parler": "to speak (verb)",
  "aimer": "to like, to love (verb)",
  "donner": "to give (verb)",
  "prendre": "to take (verb)",
  "trouver": "to find (verb)",
  "regarder": "to watch (verb)",
  "écouter": "to listen (verb)",
  "penser": "to think (verb)",
  "croire": "to believe (verb)",
  "espérer": "to hope (verb)",
  "vivre": "to live (verb)",
  "mourir": "to die (verb)",
  "naître": "to be born (verb)",
  "grandir": "to grow (verb)",
  "petit": "small (adjective)",
  "grand": "big, tall (adjective)",
  "beau": "beautiful (adjective)",
  "mauvais": "bad (adjective)",
  "vieux": "old (adjective)",
  "jeune": "young (adjective)",
  "nouveau": "new (adjective)",
  "premier": "first (adjective)",
  "dernier": "last (adjective)",
  "seul": "alone (adjective)",
  "même": "same (adjective)",
  "différent": "different (adjective)",
  "autre": "other (adjective)",
  "tout": "all, everything (adjective/pronoun)",
  "rien": "nothing (pronoun)",
  "quelque chose": "something (pronoun)",
  "quelqu'un": "someone (pronoun)",
  "personne": "no one (pronoun)",
  "toujours": "always (adverb)",
  "jamais": "never (adverb)",
  "souvent": "often (adverb)",
  "rarement": "rarely (adverb)",
  "ici": "here (adverb)",
  "là": "there (adverb)",
  "maintenant": "now (adverb)",
  "plus tard": "later (adverb)",
  "bien": "well (adverb)",
  "mal": "badly (adverb)",
  "vite": "quickly (adverb)",
  "lentement": "slowly (adverb)",
  "mange": "eats (verb)",
  "pomme": "apple (noun)",
  "rouge": "red (adjective)",
  "le soleil": "the sun (noun)",
  "brille": "shines (verb)",
  "heureux": "happy (adjective)",
  "ami": "friend (noun)",
  "joue": "plays (verb)",
  "amusant": "funny (adjective)",
  "arbre": "tree (noun)",
  "court": "runs (verb)",
  "chante": "sings (verb)",
  "doux": "sweet (adjective)",
  "fleur": "flower (noun)",
  "danse": "dances (verb)",
  "ensemble": "together (adverb)",
  "amusant": "funny (adjective)",
};

export default function StoryPage() {
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    try {
      const result = await generateFrenchStory({ topic: topic });
      setStory(result.frenchStory);
    } catch (error) {
      console.error("Failed to generate story:", error);
      setStory("Failed to generate story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDefinition = (word: string) => {
    return frenchDictionary[word.toLowerCase()] || "No definition found.";
  };

  const handleClickWord = (word: string) => {
    setSelectedWord(word);
  };

  // Function to add underline style to words/phrases
  const stylizeStory = (text: string) => {
    if (!text) return "";

    const words = text.split(/\s+/);
    const styledWords = words.map(word => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const isDefined = frenchDictionary.hasOwnProperty(cleanWord.toLowerCase());
      const underlineStyle = isDefined ? "text-decoration: underline; cursor: pointer;" : "";

      return isDefined
        ? `<span style="${underlineStyle}" onclick="(() => {
              const event = new CustomEvent('wordClick', { detail: '${cleanWord}' });
              document.dispatchEvent(event);
            })()">${word}</span>`
        : word;
    });

    return styledWords.join(" ");
  };

  const stylizedStory = stylizeStory(story);

  // Event listener to handle the wordClick event
  useEffect(() => {
    const handleWordClick = (event: any) => {
      handleClickWord(event.detail);
    };

    document.addEventListener("wordClick", handleWordClick);

    return () => {
      document.removeEventListener("wordClick", handleWordClick);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Story Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Textarea
              placeholder="Enter the topic of the story..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerateStory} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Story"}
          </Button>
          {story && (
            <div className="mt-4">
              <h3>Generated Story:</h3>
              {selectedWord && (
                <Popover open={!!selectedWord} onOpenChange={() => setSelectedWord(null)}>
                  <PopoverTrigger asChild>
                    <div></div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    {getDefinition(selectedWord)}
                  </PopoverContent>
                </Popover>
              )}
              <p
                dangerouslySetInnerHTML={{ __html: stylizedStory }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
