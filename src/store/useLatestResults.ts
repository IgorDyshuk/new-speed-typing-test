import type { TestMode } from "@/hooks/useTypingGame";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Result = {
  wpm: number;
  accuracy: number;
  consistency: number;
  totals: {
    totalTyped: number;
    correctLetters: number;
    incorrectLetters: number;
    extraLetters: number;
  };
  mode: TestMode;
  lasting: number;
  completedAt: string;
};

type LatestResultsState = {
  results: Result[];
  addResult: (result: Result) => void;
  clearResults: () => void;
};

export const useLatestStore = create<LatestResultsState>()(
  persist(
    (set, get) => ({
      results: [],
      addResult: (result) =>
        set(() => ({
          results: [result, ...get().results].slice(0, 30),
        })),
      clearResults: () => set({ results: [] }),
    }),
    {
      name: "latest-results",
      version: 1,
      migrate: (persisted, version) => {
        if (version >= 1) return persisted as LatestResultsState;
        const state = persisted as Partial<LatestResultsState>;
        const resultsWithTotals = (state.results ?? []).map((r) => ({
          ...r,
          totals: r.totals ?? {
            totalTyped: 0,
            correctLetters: 0,
            incorrectLetters: 0,
            extraLetters: 0,
          },
        }));
        return { ...state, results: resultsWithTotals } as LatestResultsState;
      },
    },
  ),
);
