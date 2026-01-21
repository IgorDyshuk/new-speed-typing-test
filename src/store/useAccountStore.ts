import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

export const TIME_TEST_PRESETS = [10, 30, 60, 120] as const;
export const WORD_TEST_PRESETS = [10, 25, 50, 100] as const;
export type TimeTestPresets = (typeof TIME_TEST_PRESETS)[number];
export type WordTestPresets = (typeof WORD_TEST_PRESETS)[number];

export type BestTestResults = {
  wpm: number;
  acc: number;
  con: number;
  language: string;
  completedAt: string;
  includeNumbers: boolean;
  includePunctuation: boolean;
};

type AccountState = {
  username: string;
  setUsername: (name: string) => void;
  createdAt: string | null;

  testStarted: number;
  incrementTestStarted: () => void;
  testCompleted: number;
  incrementTestCompleted: () => void;

  totalTypingMs: number;
  addTypingMs: (delta: number) => void;

  bestTimeResults: Record<TimeTestPresets, BestTestResults | null>;
  updateBestTimeResult: (
    duration: TimeTestPresets,
    result: BestTestResults,
  ) => boolean;

  bestWordResults: Record<WordTestPresets, BestTestResults | null>;
  updateBestWordResult: (
    words: WordTestPresets,
    result: BestTestResults,
  ) => boolean;
};

const buildInitialBestTestResults = (): Record<
  TimeTestPresets,
  BestTestResults | null
> => ({
  10: null,
  30: null,
  60: null,
  120: null,
});

const buildInitialBestWordResults = (): Record<
  WordTestPresets,
  BestTestResults | null
> => ({
  10: null,
  25: null,
  50: null,
  100: null,
});

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => {
      const canWrite = () => useAuthStore.getState().isAuthenticated;

      return {
        username: "",
        createdAt: null,
        setUsername: (name) => {
          if (!canWrite()) return;
          set((state) => {
            const trimmed = name.trim();

            return {
              username: trimmed,
              createdAt: trimmed
                ? (state.createdAt ?? new Date().toISOString())
                : null,
            };
          });
        },

        testStarted: 0,
        incrementTestStarted: () => {
          if (!canWrite()) return;
          set((state) => ({ testStarted: state.testStarted + 1 }));
        },
        testCompleted: 0,
        incrementTestCompleted: () => {
          if (!canWrite()) return;
          set((state) => ({ testCompleted: state.testCompleted + 1 }));
        },

        totalTypingMs: 0,
        addTypingMs: (delta) => {
          if (!canWrite()) return;
          set((state) => ({ totalTypingMs: state.totalTypingMs + delta }));
        },

        bestTimeResults: buildInitialBestTestResults(),
        updateBestTimeResult: (duration, result) => {
          if (!canWrite()) return false;
          const prev = get().bestTimeResults[duration];
          if (prev && prev.wpm >= result.wpm) return false;
          set((state) => ({
            bestTimeResults: { ...state.bestTimeResults, [duration]: result },
          }));
          return true;
        },

        bestWordResults: buildInitialBestWordResults(),
        updateBestWordResult: (words, result) => {
          if (!canWrite()) return false;
          const prev = get().bestWordResults[words];
          if (prev && prev.wpm >= result.wpm) return false;
          set((state) => ({
            bestWordResults: { ...state.bestWordResults, [words]: result },
          }));
          return true;
        },
      };
    },
    { name: "typing-account" },
  ),
);
