// components/theme-provider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ЕДИНЫЙ список всех тем (должны совпадать с data-theme в CSS)
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

// Тип автоматически выводится из массива
export type Theme = (typeof ALL_THEMES)[number];

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  availableThemes?: Theme[]; // можно ограничить подмножество тем
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

export function ThemeProvider({
  children,
  defaultTheme = "royal",
  storageKey = "vite-ui-theme",
  availableThemes,
}: ThemeProviderProps) {
  // выбираем актуальный список тем (всё или ограниченное подмножество)
  const themes = useMemo<Theme[]>(
    () =>
      availableThemes && availableThemes.length
        ? availableThemes
        : [...ALL_THEMES],
    [availableThemes]
  );

  // безопасно читаем initial из localStorage/дефолта и валидируем
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(storageKey);
    const initial = isValidTheme(saved) ? saved : defaultTheme;
    // если defaultTheme не входит в themes (когда availableThemes ограничен) — возьмём первый доступный
    return themes.includes(initial) ? initial : themes[0];
  });

  // если список themes меняется (через availableThemes), убедимся что текущая тема валидна
  useEffect(() => {
    if (!themes.includes(theme)) {
      const next = themes[0];
      setThemeState(next);
      localStorage.setItem(storageKey, next);
      document.documentElement.setAttribute("data-theme", next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    [theme, themes, storageKey]
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
