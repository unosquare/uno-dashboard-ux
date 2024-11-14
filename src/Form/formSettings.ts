import type { FormField } from '../constants';

export interface FormSettings<T, TData> {
    initialData: FormField<T>[];
    columns?: number;
    onSave: (data: TData) => Promise<unknown>;
    onCancel?: () => void;
    saveLabel?: string;
}

export interface FieldGroupSettings {
    $directionRow: boolean;
}

export interface FormContainerSettings {
    fields: number;
    columns: number;
}
