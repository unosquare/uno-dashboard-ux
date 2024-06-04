import { FormField } from '../constants';

export interface FormSettings<T, TData> {
    initialData: FormField<T>[];
    onSave: (data: TData) => Promise<unknown>;
    onCancel?: () => void;
    columns?: number;
}

export interface FieldGroupSettings {
    $directionRow: boolean;
}

export interface FormContainerSettings {
    fields: number;
    columns: number;
}
