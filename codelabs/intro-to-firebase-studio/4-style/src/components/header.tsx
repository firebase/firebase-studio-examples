"use client";

import { useContext } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageContext } from "@/components/language-context";
import ThemeToggle from "@/components/theme-toggle";
import { DoorOpen } from "lucide-react";

export default function Header() {
  const { language, setLanguage } = useContext(LanguageContext);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <header className="bg-secondary text-secondary-foreground py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <DoorOpen className="h-6 w-6 text-primary" />
          Speak Easy
        </h1>
        <div className="flex items-center gap-4">
            <div
              className="flex flex-col items-center space-y-2 mr-6"
            >
              <label
                htmlFor="language"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
              >
                Language
              </label>
              <Select onValueChange={handleLanguageChange} defaultValue={language} id="language">
                <SelectTrigger className="w-[180px] shadow-sm">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-2">
              <ThemeToggle />
            </div>
          </div>
      </div>
    </header>
  );
}

