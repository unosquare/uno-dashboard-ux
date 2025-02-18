import type { UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { type FormField, FormFieldTypes } from '../constants';

export const extractData = <T, TData>(data: FormField<T>[]) =>
    data.reduce(
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        (acc, field) => ({ ...acc, [field.name]: field.value }),
        {} as TData,
    );

export const getFieldBaseProps = <T>(
    field: FormField<T>,
    register: UseFormRegister<{ table: FormField<T>[] }>,
    index: number,
    disabled: boolean,
) => ({
    disabled: disabled || field.disabled,
    id: field.label,
    type: field.type ?? FormFieldTypes.Text,
    className: twMerge('my-1', disabled && '[&_input]:text-unodashboard-content-subtle'),
    ...register(`table.${index}.value`, {
        required: field.type !== FormFieldTypes.Checkbox && !field.notRequired,
    }),
});

export const onSelectChange = (event: string, callback: (x: string) => void, defaultCallback?: (x: string) => void) => {
    callback(event);
    if (defaultCallback) defaultCallback(event);
};

export const onMultiSelectChange = (
    event: string[],
    callback: (x: string[]) => void,
    defaultCallback?: (x: string[]) => void,
) => {
    callback(event);
    if (defaultCallback) defaultCallback(event);
};
