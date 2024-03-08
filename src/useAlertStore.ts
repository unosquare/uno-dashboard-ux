import { create } from 'zustand';
import { Alert } from './Alert';

interface Alert {
    id: number;
    message: string;
    isSuccess: boolean;
    isTimed: boolean;
}

interface AlertList {
    activeAlerts: Alert[];
    setAlert: (isSuccess: boolean, message?: string, isTimed?: boolean) => void;
    deleteAlerts: (alertId: number) => void;
}

export default create<AlertList>((set) => ({
    activeAlerts: [],
    setAlert: (isSuccess: boolean, message?: string, isTimed: boolean = true) =>
        set((state) => ({
            activeAlerts: [
                ...state.activeAlerts,
                {
                    isSuccess: isSuccess,
                    isTimed: isTimed,
                    message: message ?? (isSuccess ? 'Changes Saved Successfully' : 'Something Went Wrong'),
                    id: Date.now(),
                },
            ],
        })),
    deleteAlerts: (alertId: number) =>
        set((state) => ({ activeAlerts: state.activeAlerts.filter((alert) => alert.id !== alertId) })),
}));
