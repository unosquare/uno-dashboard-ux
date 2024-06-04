/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, DatePicker, Flex, NumberInput, Select, SelectItem, Text, TextInput } from '@tremor/react';
import { FormSettings } from './formSettings';
import { StyledCheckbox, StyledFieldGroup, StyledFormContainer } from './styled';
import { extractData, getFieldBaseProps, onSelectChange } from './utils';
import { FormFieldTypes } from '../constants';
import { VirtualSelect } from '../VirtualSelect';

export const Form = <T, TData>({ initialData, onSave, onCancel, columns = 3 }: FormSettings<T, TData>) => {
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
                            switch (item.type) {
                                case FormFieldTypes.Date:
                                    return (
                                        <Controller
                                            name={`table.${index}.value`}
                                            rules={{ required: !updatedField.notRequired }}
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={new Date(field.value as string)}
                                                    onValueChange={field.onChange}
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
                                            rules={{ required: !updatedField.notRequired }}
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
                                            rules={{ required: !updatedField.notRequired }}
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
                                case FormFieldTypes.Checkbox:
                                    return <StyledCheckbox {...fieldProps} />;
                                case FormFieldTypes.Number:
                                    return <NumberInput {...fieldProps} />;
                                default:
                                    return <TextInput {...fieldProps} type='text' />;
                            }
                        })()}
                    </StyledFieldGroup>
                ))}
            </StyledFormContainer>
            <Flex justifyContent='end' className='mt-4 gap-4'>
                {fields.filter((y) => y.disabled === true).length !== fields.length && (
                    <Button className='w-[120px]' disabled={disable || !isValid} onClick={onSaveData}>
                        Save
                    </Button>
                )}
                {onCancel && (
                    <Button className='w-[120px]' variant='secondary' onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </Flex>
        </>
    );
};
