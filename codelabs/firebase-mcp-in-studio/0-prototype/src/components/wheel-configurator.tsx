"use client";

import { useState } from "react";
import type { Wheel, Section } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Sparkles, Loader2, ListOrdered } from "lucide-react";
import { generateColors } from "@/lib/colors";
import { suggestWheelSections } from "@/ai/flows/suggest-wheel-sections";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface WheelConfiguratorProps {
  wheel: Wheel;
  onWheelChange: (updatedWheel: Wheel) => void;
}

export default function WheelConfigurator({ wheel, onWheelChange }: WheelConfiguratorProps) {
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWheelChange({ ...wheel, name: e.target.value });
  };

  const handleSectionChange = (id: string, value: string) => {
    const updatedSections = wheel.sections.map((s) =>
      s.id === id ? { ...s, value } : s
    );
    onWheelChange({ ...wheel, sections: updatedSections });
  };

  const addSection = () => {
    const newSection: Section = { id: crypto.randomUUID(), value: "" };
    const updatedSections = [...wheel.sections, newSection];
    onWheelChange({
      ...wheel,
      sections: updatedSections,
      colors: generateColors(updatedSections.length),
    });
  };

  const removeSection = (id: string) => {
    const updatedSections = wheel.sections.filter((s) => s.id !== id);
    onWheelChange({
      ...wheel,
      sections: updatedSections,
      colors: generateColors(updatedSections.length),
    });
  };

  const getSuggestions = async () => {
    setIsSuggestionsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestWheelSections({
        currentSections: wheel.sections.map((s) => s.value).filter(Boolean),
      });
      setSuggestions(result.suggestedSections);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      // Here you could add a toast notification for the error
    } finally {
      setIsSuggestionsLoading(false);
    }
  };
  
  const addSuggestion = (suggestion: string) => {
    const newSection: Section = { id: crypto.randomUUID(), value: suggestion };
    const updatedSections = [...wheel.sections, newSection];
    onWheelChange({
        ...wheel,
        sections: updatedSections,
        colors: generateColors(updatedSections.length),
    });
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const handleClearHistory = () => {
    onWheelChange({ ...wheel, history: [] });
  };


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Customize Wheel</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100%-80px)] flex-col gap-4">
        <Input
          aria-label="Wheel name"
          value={wheel.name}
          onChange={handleNameChange}
          className="text-lg font-semibold"
        />

        <Separator />

        <h3 className="font-semibold text-muted-foreground">Sections</h3>
        <ScrollArea className="flex-1 pr-4">
          <div className="flex flex-col gap-2">
            {wheel.sections.map((section) => (
              <div key={section.id} className="flex items-center gap-2">
                <Input
                  value={section.value}
                  onChange={(e) => handleSectionChange(section.id, e.target.value)}
                  placeholder="Enter section text..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSection(section.id)}
                  aria-label="Remove section"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addSection} className="mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </div>
        </ScrollArea>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" onClick={getSuggestions} disabled={isSuggestionsLoading}>
              {isSuggestionsLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Suggestions
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>AI Suggestions</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-64">
              <div className="flex flex-col gap-2 p-1">
                {suggestions.length > 0 ? (
                    suggestions.map((suggestion, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 rounded-md bg-accent/50 p-2">
                        <p className="flex-1 text-sm">{suggestion}</p>
                        <Button size="sm" onClick={() => addSuggestion(suggestion)}>Add</Button>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-muted-foreground">No suggestions found.</p>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {wheel.history && wheel.history.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                  <ListOrdered className="w-4 h-4"/>
                  Recent Spins
                </h3>
                <Button variant="ghost" size="sm" onClick={handleClearHistory} className="h-auto px-2 py-1 text-xs text-muted-foreground">
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground/80">
                {wheel.history.map((item, index) => (
                  <p key={index} className="truncate rounded bg-accent/50 px-2 py-1">{item}</p>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
