import { create } from 'zustand';

interface AlertState {
    message?: string;
    isSuccess?: boolean;
    setAlert: (isSuccess: boolean, message?: string) => void;
}

export default create<AlertState>((set) => ({
    isSuccess: undefined,
    message: undefined,
    setAlert: (isSuccess: boolean, message?: string) => {
        set(() => {
            setTimeout(() => set({ isSuccess, message }), 200);

            return { message: undefined, isSuccess: undefined };
        });
    },
}));
