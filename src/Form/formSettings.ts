import { FormField } from '../constants';

export interface ReadOnlyFormSettings<T> {
    initialData: FormField<T>[];
    columns?: number;
}

export interface FormSettings<T, TData> extends ReadOnlyFormSettings<T> {
    onSave: (data: TData) => Promise<unknown>;
    onCancel?: () => void;
}

export interface FieldGroupSettings {
    $directionRow: boolean;
}

export interface FormContainerSettings {
    fields: number;
    columns: number;
}
