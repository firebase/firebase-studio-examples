"use client";

import Link from 'next/link';
import {BookOpen, MessageSquare} from 'lucide-react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Speak Easy</CardTitle>
          <CardDescription>Choose a section to start learning French.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/story" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-secondary">
              <BookOpen className="h-6 w-6 mb-2"/>
              AI Story Generator
            </Link>
            <Link href="/flashcards" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 2.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Interactive Flashcards
            </Link>
            <Link href="/chatbot" className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-secondary">
              <MessageSquare className="h-6 w-6 mb-2"/>
              AI Chatbot Tutor
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">This app helps you learn French with AI-generated stories, flashcards, and a chatbot.</p>
        </CardContent>
      </Card>
    </div>
  );
}

