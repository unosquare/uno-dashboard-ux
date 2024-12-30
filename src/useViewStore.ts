import { create } from 'zustand';

interface IViewState {
    openMenu: boolean;
    toggleMenu: () => void;
    disableCoeFilter: boolean;
    disableMainSkillFilter: boolean;
}

export const useViewStore = create<IViewState>((set) => ({
    openMenu: false,
    disableCoeFilter: false,
    disableMainSkillFilter: false,
    toggleMenu: () =>
        set((state) => {
            const toggledState = !state.openMenu;
            const body = document.getElementById('body');
            if (body) body.style.overflow = toggledState ? 'auto' : 'hidden';

            return { openMenu: toggledState };
        }),
}));