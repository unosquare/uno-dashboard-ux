import { YearMonth } from 'uno-js';
import { create } from 'zustand';

interface FilterState {
    month: YearMonth;
    setMonth: (month: number) => void;
    nextQuarter: () => void;
    previousQuarter: () => void;
    nextYear: () => void;
    previousYear: () => void;
}

export default create<FilterState>((set, get) => ({
    month: new YearMonth(YearMonth.Current.Year, YearMonth.Current.Month),

    setMonth: (month: number) => {
        const current = get().month;
        if (current.Month !== month) set({ month: new YearMonth(current.Year, month) });
    },

    nextQuarter: () => {
        const current = get().month;
        const newMonth = YearMonth.FromDate(current.YearQuarter.Next.StartDate);
        if (!(newMonth.Year === current.Year && newMonth.Month === current.Month)) set({ month: newMonth });
    },

    previousQuarter: () => {
        const current = get().month;
        const newMonth = YearMonth.FromDate(current.YearQuarter.Previous.StartDate);
        if (!(newMonth.Year === current.Year && newMonth.Month === current.Month)) set({ month: newMonth });
    },

    nextYear: () => {
        const current = get().month;
        const nextYear = current.Year + 1;
        if (nextYear !== current.Year) set({ month: new YearMonth(nextYear, current.Month) });
    },

    previousYear: () => {
        const current = get().month;
        const previousYear = current.Year - 1;
        if (previousYear !== current.Year) set({ month: new YearMonth(previousYear, current.Month) });
    },
}));