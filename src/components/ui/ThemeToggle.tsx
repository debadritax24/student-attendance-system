"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="theme-toggle-icon-wrap">
        {isDark ? (
          <Sun size={17} className="theme-icon sun-icon" strokeWidth={2.2} />
        ) : (
          <Moon size={17} className="theme-icon moon-icon" strokeWidth={2.2} />
        )}
      </div>
      {showLabel && (
        <span className="theme-toggle-label">{isDark ? "Light mode" : "Dark mode"}</span>
      )}
    </button>
  );
}
