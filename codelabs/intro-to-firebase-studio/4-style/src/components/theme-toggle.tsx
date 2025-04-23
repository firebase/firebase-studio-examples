"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("theme") || "light";
      }
      return "light";
    }
  );

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("theme", theme);
    }
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("theme-light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("theme-light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
