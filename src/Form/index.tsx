import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { Flex } from '../Flex';
import { MultiSelect, MultiSelectItem } from '../MultiSelect';
import { NumberInput } from '../NumberInput';
import { Select, SelectItem } from '../Select';
import { Textarea } from '../TextArea';
import { Text } from '../TextElements';
import { TextInput } from '../TextInput';
import { VirtualSelect } from '../VirtualSelect';
import { FormFieldTypes } from '../constants';
import { StyledFieldGroup, StyledFormContainer } from '../styled';
import type { FormSettings } from './formSettings';
import { StyledCheckbox, StyledFileInput } from './styled';
import { extractData, getFieldBaseProps, onMultiSelectChange, onSelectChange } from './utils';

export const Form = <T, TData>({
    initialData,
    onSave,
    onCancel,
    onChange,
    saveLabel,
    columns = 3,
}: FormSettings<T, TData>) => {
    const {
        register,
        watch,
        control,
        trigger,
        reset,
        formState: { isValid },
    } = useForm({ defaultValues: { table: initialData } });
    const { fields } = useFieldArray({ control, name: 'table' });
    const [disable, setDisable] = useState<boolean>(false);

    const onSaveData = async () => {
        const result = await trigger(undefined, { shouldFocus: true });
        if (!result) return;

        setDisable(true);

        try {
            const data = extractData<T, TData>(watch('table'));
            await onSave(data);
            reset({ table: initialData });
        } catch (e) {
            console.error('Data could not be saved', e);
        }

        setDisable(false);
    };

    return (
        <>
            <StyledFormContainer fields={initialData.length} columns={columns}>
                {fields.map((item, index) => (
                    <StyledFieldGroup key={item.id} $directionRow={item.type === FormFieldTypes.Checkbox}>
                        <Text>{item.label}</Text>
                        {(() => {
                            const updatedField = initialData[index] ?? item;
                            const fieldProps = getFieldBaseProps(updatedField, register, index, disable);

                            const handleFieldChange = (value: string | number | Date | undefined) =>
                                onChange?.(updatedField.name, value);

                            switch (item.type) {
                                case FormFieldTypes.Date:
                                    return (
                                        <Controller
                                            name={`table.${index}.value`}
                                            rules={{
                                                required: !updatedField.notRequired,
                                            }}
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                    value={field.value as any}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        handleFieldChange(value);
                                                    }}
                                                    disabled={disable || updatedField.disabled}
                                                    enableClear={false}
                                                    className='my-1'
                                                    ref={field.ref}
                                                />
                                            )}
                                        />
                                    );
                                case FormFieldTypes.VirtualSelect:
                                    return (
                                        <Controller
                                            name={`table.${index}.value`}
                                            rules={{
                                                required: !updatedField.notRequired,
                                            }}
                                            control={control}
                                            render={({ field }) => (
                                                <VirtualSelect
                                                    value={initialData[index].options
                                                        ?.find((c) => c.value.toString() === field.value)
                                                        ?.value?.toString()}
                                                    onValueChange={(e) =>
                                                        onSelectChange(e, field.onChange, item.onChange)
                                                    }
                                                    options={initialData[index].options ?? []}
                                                    disabled={disable || updatedField.disabled}
                                                    className='my-1'
                                                    ref={field.ref}
                                                />
                                            )}
                                        />
                                    );
                                case FormFieldTypes.Select:
                                    return (
                                        <Controller
                                            name={`table.${index}.value`}
                                            rules={{
                                                required: !updatedField.notRequired,
                                            }}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    enableClear={false}
                                                    value={initialData[index].options
                                                        ?.find((c) => c.value.toString() === field.value)
                                                        ?.value?.toString()}
                                                    onValueChange={(e) =>
                                                        onSelectChange(e, field.onChange, item.onChange)
                                                    }
                                                    disabled={disable || updatedField.disabled}
                                                    className='my-1'
                                                    ref={field.ref}
                                                >
                                                    {(initialData[index].options ?? []).map((u) => (
                                                        <SelectItem key={u.value} value={u.value.toString()}>
                                                            {u.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    );
                                case FormFieldTypes.MultiSelect:
                                    return (
                                        <Controller
                                            name={`table.${index}.value`}
                                            rules={{
                                                required: !updatedField.notRequired,
                                            }}
                                            control={control}
                                            render={({ field }) => (
                                                <MultiSelect
                                                    value={
                                                        initialData[index].options
                                                            ?.filter((c) =>
                                                                field.value && (field.value as string[]).length > 0
                                                                    ? (field.value as string[]).includes(
                                                                          c.value.toString(),
                                                                      )
                                                                    : undefined,
                                                            )
                                                            ?.map((c) => String(c.value)) ?? []
                                                    }
                                                    onValueChange={(e) => onMultiSelectChange(e, field.onChange)}
                                                    disabled={disable || updatedField.disabled}
                                                    className='my-1'
                                                    ref={field.ref}
                                                >
                                                    {(initialData[index].options ?? []).map((u) => (
                                                        <MultiSelectItem key={u.value} value={u.value.toString()}>
                                                            {u.label}
                                                        </MultiSelectItem>
                                                    ))}
                                                </MultiSelect>
                                            )}
                                        />
                                    );
                                case FormFieldTypes.Checkbox:
                                    return <StyledCheckbox {...fieldProps} />;
                                case FormFieldTypes.Number:
                                    return <NumberInput {...fieldProps} />;
                                case FormFieldTypes.TextArea:
                                    return <Textarea {...fieldProps} className='max-w-full' />;
                                case FormFieldTypes.File:
                                    return (
                                        <StyledFileInput
                                            id='file'
                                            name='file'
                                            type='file'
                                            className='mt-1'
                                            accept='.pdf'
                                        />
                                    );
                                default:
                                    return <TextInput {...fieldProps} type='text' />;
                            }
                        })()}
                    </StyledFieldGroup>
                ))}
            </StyledFormContainer>
            <Flex justifyContent='end' className='mt-4 gap-4'>
                <Button className='w-28' disabled={disable || !isValid} onClick={onSaveData}>
                    {saveLabel ?? 'Save'}
                </Button>
                {onCancel && (
                    <Button className='w-28' variant='secondary' onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </Flex>
        </>
    );
};
