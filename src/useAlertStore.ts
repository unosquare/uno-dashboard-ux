import { create } from 'zustand';
import { Alert } from './Alert';

// interface AlertState {
//     message?: string;
//     isSuccess?: boolean;
//     setAlert: (isSuccess: boolean, message?: string) => void;
// }

// export default create<AlertState>((set) => ({
//     isSuccess: undefined,
//     message: undefined,
//     setAlert: (isSuccess: boolean, message?: string) => {
//         set(() => {
//             setTimeout(() => set({ isSuccess, message }), 200);

//             return { message: undefined, isSuccess: undefined };
//         });
//     },
// }));

interface Alert {
    id: number;
    message: string;
    isSuccess: boolean;
}

interface AlertList {
    activeAlerts: Alert[];
    setActiveAlerts: (id: number, message: string, isSuccess: boolean) => void;
}

export default create<AlertList>((set) => ({
    activeAlerts: [],
    setActiveAlerts: (id: number, message: string, isSuccess: boolean) => {
        set((state) => [...state, { message: message, isSuccess: isSuccess, id: id }]);
    },
}));
