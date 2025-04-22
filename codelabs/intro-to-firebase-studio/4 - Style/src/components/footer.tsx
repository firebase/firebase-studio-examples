"use client";

import Link from 'next/link';
import { BookOpen, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function Footer() {
  const pathname = usePathname();

  const navItems = [
    { href: "/story", label: "Read", icon: BookOpen },
    { href: "/flashcards", label: "Practice", icon: "Flashcards" },
    { href: "/chatbot", label: "Chat", icon: MessageSquare },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-4 mt-8">
      <div className="container mx-auto px-4">
        <nav className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center transition-colors hover:text-primary",
                { "text-primary": pathname === item.href }
              )}
            >
              {item.icon === "Flashcards" ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mb-1"
                >
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 2.9 2.9 4 4 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <item.icon className="h-6 w-6 mb-1" />
              )}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

