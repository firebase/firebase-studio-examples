"use client";

import { useState } from "react";
import { frenchChatbotTutor } from "@/ai/flows/french-chatbot-tutor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatbotPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setChatHistory((prevHistory) => [...prevHistory, { type: "user", text: userInput }]);
    setIsLoading(true);

    try {
      const result = await frenchChatbotTutor({ userInput: userInput });
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", text: result.chatbotResponse },
      ]);
    } catch (error) {
      console.error("Failed to get chatbot response:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "bot", text: "Failed to get response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput(""); // Clear the input after sending
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <div className="mb-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-md ${
                  message.type === "user" ? "bg-primary text-primary-foreground self-end" : "bg-secondary text-foreground self-start"
                }`}
                style={{ maxWidth: "80%" }}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <div className="mb-2">Loading...</div>}
          </div>
          <div className="flex">
            <Input
              type="text"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
