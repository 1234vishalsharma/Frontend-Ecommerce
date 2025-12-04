"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

/**
 * Theme context for managing dark/light mode across the app
 */
interface ThemeModeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within Providers component");
  }
  return context;
};

/**
 * ThemeContent component - separated to ensure context is available to children
 * This component consumes the context that was created by the parent Providers
 */
function ThemeContent({ children }: { children: ReactNode }) {
  const { isDark } = useThemeMode();

  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    typography: {
      fontFamily: '"Geist", sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

/**
 * Providers component wraps the app with MUI theme and context providers
 * Handles theme persistence to localStorage
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setIsDark(saved === "dark");
    } else {
      // Check system preference
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  return (
    <ThemeModeContext.Provider value={{ isDark, toggleTheme }}>
      {mounted ? (
        <ThemeContent>{children}</ThemeContent>
      ) : (
        // On first load before mount, just render children without theme to prevent flash
        <>{children}</>
      )}
    </ThemeModeContext.Provider>
  );
}
