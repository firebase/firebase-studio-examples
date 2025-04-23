"use client";

import { useState, useEffect, useContext } from "react";
import { generateStory } from "@/ai/flows/generate-french-story";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LanguageContext } from "@/components/language-context";

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
  "et": "and (conjunction)",
  "il": "he (pronoun)",
  "elle": "she (pronoun)",
  "nous": "we (pronoun)",
  "vous": "you (formal/plural pronoun)",
  "ils": "they (masculine plural pronoun)",
  "elles": "they (feminine plural pronoun)",
  "ceci": "this (pronoun)",
  "cela": "that (pronoun)",
  "ici": "here (adverb)",
  "là": "there (adverb)",
  "déjà": "already (adverb)",
  "encore": "again (adverb)",
  "juste": "just (adverb)",
  "seulement": "only (adverb)",
  "vers": "towards (preposition)",
  "sans": "without (preposition)",
  "sous": "under (preposition)",
  "sur": "on (preposition)",
};

const japaneseDictionary: { [key: string]: string } = {
  "猫": "cat (noun)",
  "猫 (neko)": "cat (noun)",
  "家": "house (noun)",
  "家 (ie)": "house (noun)",
  "こんにちは": "hello (greeting)",
  "こんにちは (konnichiwa)": "hello (greeting)",
  "さようなら": "goodbye (farewell)",
  "さようなら (sayounara)": "goodbye (farewell)",
  "ありがとう": "thank you (expression of gratitude)",
  "ありがとう (arigatou)": "thank you (expression of gratitude)",
  "お願いします": "please (polite request)",
  "お願いします (onegaishimasu)": "please (polite request)",
  "はい": "yes (affirmative response)",
  "いいえ": "no (negative response)",
  "ある": "to be, to exist (inanimate objects) (verb)",
  "いる": "to be, to exist (animate objects) (verb)",
  "する": "to do (verb)",
  "行く": "to go (verb)",
  "来る": "to come (verb)",
  "欲しい": "to want (adjective)",
  "出来る": "to be able to (verb)",
  "しなければならない": "to have to, must (verb)",
  "知る": "to know (verb)",
  "理解する": "to understand (verb)",
  "話す": "to speak (verb)",
  "好き": "to like (adjective)",
  "与える": "to give (verb)",
  "取る": "to take (verb)",
  "見つける": "to find (verb)",
  "見る": "to watch (verb)",
  "聞く": "to listen (verb)",
  "考える": "to think (verb)",
  "信じる": "to believe (verb)",
  "望む": "to hope (verb)",
  "生きる": "to live (verb)",
  "死ぬ": "to die (verb)",
  "生まれる": "to be born (verb)",
  "育つ": "to grow (verb)",
  "小さい": "small (adjective)",
  "大きい": "big (adjective)",
  "美しい": "beautiful (adjective)",
  "悪い": "bad (adjective)",
  "古い": "old (adjective)",
  "若い": "young (adjective)",
  "新しい": "new (adjective)",
  "最初": "first (adjective)",
  "最後": "last (adjective)",
  "一人": "alone (adjective)",
  "同じ": "same (adjective)",
  "違う": "different (adjective)",
  "他の": "other (adjective)",
  "全て": "all, everything (adjective/pronoun)",
  "何もない": "nothing (pronoun)",
  "何か": "something (pronoun)",
  "誰か": "someone (pronoun)",
  "誰も": "no one (pronoun)",
  "いつも": "always (adverb)",
  "決して": "never (adverb)",
  "よく": "often (adverb)",
  "めったに": "rarely (adverb)",
  "ここ": "here (adverb)",
  "そこ": "there (adverb)",
  "今": "now (adverb)",
  "後で": "later (adverb)",
  "良い": "well (adverb)",
  "悪い": "badly (adverb)",
  "速く": "quickly (adverb)",
  "ゆっくり": "slowly (adverb)",
  "食べる": "eats (verb)",
  "林檎": "apple (noun)",
  "赤い": "red (adjective)",
  "太陽": "the sun (noun)",
  "輝く": "shines (verb)",
  "幸せ": "happy (adjective)",
  "友達": "friend (noun)",
  "遊ぶ": "plays (verb)",
  "面白い": "funny (adjective)",
  "木": "tree (noun)",
  "走る": "runs (verb)",
  "歌う": "sings (verb)",
  "甘い": "sweet (adjective)",
  "花": "flower (noun)",
  "踊る": "dances (verb)",
  "一緒に": "together (adverb)",
  "面白い": "funny (adjective)",
  "これ": "this (pronoun)",
  "それ": "that (pronoun)",
  "あれ": "that (over there) (pronoun)",
  "どれ": "which (pronoun)",
  "私": "I (pronoun)",
  "あなた": "you (pronoun)",
  "彼": "he (pronoun)",
  "彼女": "she (pronoun)",
  "私たち": "we (pronoun)",
  "彼ら": "they (pronoun)",
  "彼女ら": "they (feminine) (pronoun)",
  "とても": "very (adverb)",
  "少し": "a little (adverb)",
  "たくさん": "a lot (adverb)",
  "本当に": "really (adverb)",
  "すでに": "already (adverb)",
  "まだ": "not yet (adverb)",
  "いつも": "always (adverb)",
  "決して": "never (adverb)",
  "多分": "maybe (adverb)",
  "例えば": "for example (adverb)",
};

export default function StoryPage() {
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const { language } = useContext(LanguageContext);

  const handleGenerateStory = async () => {
    setIsLoading(true);
    try {
      const result = await generateStory({ topic: topic, language: language });
      setStory(result.story);
    } catch (error) {
      console.error("Failed to generate story:", error);
      setStory("Failed to generate story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDictionary = () => {
    switch (language) {
      case "french":
        return frenchDictionary;
      case "japanese":
        return japaneseDictionary;
      default:
        return frenchDictionary;
    }
  };

  const getDefinition = (word: string) => {
    const dictionary = getDictionary();
    return dictionary[word.toLowerCase()] || "No definition found.";
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
      const dictionary = getDictionary();
      const isDefined = dictionary.hasOwnProperty(cleanWord.toLowerCase());
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
