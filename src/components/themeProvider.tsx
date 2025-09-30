import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

function isValidTheme(x: any): x is Theme {
  return typeof x === "string" && (ALL_THEMES as readonly string[]).includes(x);
}

//TODO: Добавить стейст-менеджер зюстанд и с помощью его запонминать какакя тема выбрана была выбрана последняя и вставлять ее при повторном открытии страницы
export function ThemeProvider({
  children,
  defaultTheme = "royal",
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

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    const initial = isValidTheme(saved) ? saved : defaultTheme;
    const applied = themes.includes(initial) ? initial : themes[0];

    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", applied);
    }
    return applied;
  });

  useEffect(() => {
    if (!themes.includes(theme)) {
      const next = themes[0];
      setThemeState(next);
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
        setThemeState(t);
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
