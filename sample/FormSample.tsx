import { Title } from '@tremor/react';
import React from 'react';
import { FormFieldTypes, Form } from '../src';

const selectOptions = [
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Mexico', value: 'Mexico' },
];

const fields = [
    {
        label: 'Name',
        name: 'name',
    },
    {
        label: 'Age',
        name: 'age',
        type: FormFieldTypes.Number,
    },
    {
        label: 'Country',
        name: 'country',
        type: FormFieldTypes.VirtualSelect,
        options: selectOptions
    },
    {
        label: 'Birth Country',
        name: 'birthCountry',
        type: FormFieldTypes.Select,
        options: selectOptions,
        notRequired: true,
    },
    {
        label: 'Can Drive?',
        name: 'canDrive',
        type: FormFieldTypes.Checkbox,
    },
    {
        label: 'License Date',
        name: 'licenseDate',
        type: FormFieldTypes.Date,
        notRequired: true,
    },
];

export default () => {
    const onSave = async (data: unknown) => console.log(data);

    return (
        <>
            <Title className='w-full'>Form</Title>
            <Form initialData={fields} onSave={onSave} />
        </>
    );
};