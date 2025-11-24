import { create } from "zustand";
import { persist } from "zustand/middleware";

export const TIME_TEST_PRESETS = [10, 30, 60, 120] as const;
export type TimeTestPresets = (typeof TIME_TEST_PRESETS)[number];

type BestTimeResults = {
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

  bestTimeResults: Record<TimeTestPresets, BestTimeResults | null>;
  updateBestTimeResult: (
    duration: TimeTestPresets,
    result: BestTimeResults,
  ) => void;
};

const buildInitialBestResults = (): Record<
  TimeTestPresets,
  BestTimeResults | null
> => ({
  10: null,
  30: null,
  60: null,
  120: null,
});

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      username: "",
      createdAt: null,
      setUsername: (name) =>
        set((state) => {
          const trimmed = name.trim();

          return {
            username: trimmed,
            createdAt: trimmed
              ? (state.createdAt ?? new Date().toISOString())
              : null,
          };
        }),

      testStarted: 0,
      incrementTestStarted: () =>
        set((state) => ({ testStarted: state.testStarted + 1 })),
      testCompleted: 0,
      incrementTestCompleted: () =>
        set((state) => ({ testCompleted: state.testCompleted + 1 })),

      totalTypingMs: 0,
      addTypingMs: (delta) =>
        set((state) => ({ totalTypingMs: state.totalTypingMs + delta })),

      bestTimeResults: buildInitialBestResults(),
      updateBestTimeResult: (duration, result) =>
        set((state) => {
          const prev = state.bestTimeResults[duration];
          if (prev && prev.wpm >= result.wpm) return state;
          return {
            bestTimeResults: {
              ...state.bestTimeResults,
              [duration]: result,
            },
          };
        }),
    }),
    { name: "typing-account" },
  ),
);
