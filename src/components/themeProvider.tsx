import { useThemeStore } from "@/store/useThemeStore";
import { createContext, useContext, useEffect, useMemo } from "react";

export const ALL_THEMES = [
  "royal",
  "ocean",
  "slate",
  "classic-light",
  "nord-light",
  "grayscale",
  "lavender",
  "mono-dark",
  "military",
  "sage",
  "pastel-pink",
  "violet-steel",
  "sunrise-sea",
  "one-dark",
  "moonlight",
  "everforest",
  "galaxy",
  "nord-dark",
  "cyberpunk",
  "neon-dream",
  "solarized-dark",
  "midnight",
] as const;

export type Theme = (typeof ALL_THEMES)[number];

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  availableThemes?: Theme[];
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  storageKey = "vite-ui-theme",
  availableThemes,
}: ThemeProviderProps) {
  const themes = useMemo<Theme[]>(
    () =>
      availableThemes && availableThemes.length
        ? availableThemes
        : [...ALL_THEMES],
    [availableThemes],
  );

  const theme = useThemeStore((state) => state.theme);
  const setThemeInStore = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (!themes.includes(theme)) {
      const next = themes[0];
      setThemeInStore(next);
      localStorage.setItem(storageKey, next);
      document.documentElement.setAttribute("data-theme", next);
    }
  }, [themes]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (t: Theme) => {
        if (!themes.includes(t)) return;
        localStorage.setItem(storageKey, t);
        setThemeInStore(t);
      },
      themes,
    }),
    [theme, themes, storageKey],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
