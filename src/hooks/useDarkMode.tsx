import { useState, useEffect } from "react";

export function useDarkMode() {
  // Initialize theme state from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  const [checked, setChecked] = useState(theme === "dark");

  // Apply theme immediately on initialization
  useEffect(() => {
    // Update the HTML element's data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);

    // Also set on body for extra coverage
    document.body.setAttribute("data-theme", theme);

    // Persist in localStorage
    localStorage.setItem("theme", theme);
    
    // Force a style update
    document.body.style.background = theme === 'dark' ? '#0f172a' : '#ffffff';
    document.body.style.color = theme === 'dark' ? '#f1f5f9' : '#1f2937';
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setChecked(newTheme === "dark");
  };

  return { theme, toggleTheme, checked };
}