import { create } from "zustand";

type DaylyStatsState = {
    dateKey: string;
    totalMs: number;
    addMs: (delta: number) => void;
    resetToday: () => void;
}

const todayKey = () => new Date().toISOString().slice(0, 10)

export const useDaylyStatsStore = create<DaylyStatsState>((set, get) => ({
    dateKey: todayKey(),
    totalMs: 0,
    addMs: (delta) => {
        const key = todayKey();
        const state = get();
        if (state.dateKey !== key) {
            set({dateKey: key, totalMs: delta})
        } else {
            set({totalMs: state.totalMs + delta})
        }
    },
    resetToday: () => set({dateKey: todayKey(), totalMs: 0})
}))