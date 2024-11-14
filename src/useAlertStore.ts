import { create } from 'zustand';

interface AlertObject {
    id: number;
    message: string;
    isSuccess: boolean;
    isTimed: boolean;
}

interface AlertList {
    activeAlerts: AlertObject[];
    setAlert: (isSuccess: boolean, message?: string, isTimed?: boolean) => void;
    deleteAlerts: (alertId: number) => void;
}

export default create<AlertList>((set) => ({
    activeAlerts: [],
    setAlert: (isSuccess: boolean, message?: string, isTimed = true) =>
        set((state) => ({
            activeAlerts: [
                ...state.activeAlerts,
                {
                    isSuccess,
                    isTimed,
                    message: message ?? (isSuccess ? 'Changes Saved Successfully' : 'Something Went Wrong'),
                    id: Date.now(),
                },
            ],
        })),
    deleteAlerts: (alertId: number) =>
        set((state) => ({
            activeAlerts: state.activeAlerts.filter((alert) => alert.id !== alertId),
        })),
}));
