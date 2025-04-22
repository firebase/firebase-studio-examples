"use client";

import { useState } from "react";
import { generateFrenchStory } from "@/ai/flows/generate-french-story";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StoryPage() {
  const [topic, setTopic] = useState("");
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
              <p>{story}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
