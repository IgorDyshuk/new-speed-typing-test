import type { TestMode } from "@/hooks/useTypingGame";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  duration: number;
  wordCount: number;
  mode: TestMode;
  withNumbers: boolean;
  withPunctuation: boolean;
  setDuration: (value: number) => void;
  setWordCount: (value: number) => void;
  setMode: (value: TestMode) => void;
  setWithNumbers: (value: boolean) => void;
  setWithPunctuation: (value: boolean) => void;
};

export const defaultSettings = {
  duration: 30,
  wordCount: 100,
  mode: "time" as TestMode,
  withNumbers: false,
  withPunctuation: false,
};

export const useGameSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setDuration: (value) => set({ duration: value }),
      setWordCount: (value) => set({ wordCount: value }),
      setMode: (value) => set({ mode: value }),
      setWithNumbers: (value) => set({ withNumbers: value }),
      setWithPunctuation: (value) => set({ withPunctuation: value }),
    }),
    { name: "typing-test-settings" },
  ),
);
