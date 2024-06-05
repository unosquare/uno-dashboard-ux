import { Title } from '@tremor/react';
import React from 'react';
import { FormFieldTypes, ReadOnlyForm } from '../src';

const selectOptions = [
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    { label: 'Mexico', value: 'Mexico' },
];

const fields = [
    {
        label: 'Name',
        value: 'John Doe'
    },
    {
        label: 'Age',
        value: 30,
    },
    {
        label: 'Country',
        value: 'USA',
    },
    {
        label: 'Birth Country',
        value: 'Canada',
    },
    {
        label: 'Can Drive?',
        value: 'Yes',
    },
    {
        label: 'License Date',
        value: '01/01/2021',
    },
];

export default () => (
    <>
        <Title className='w-full'>Read Only Form</Title>
        <ReadOnlyForm initialData={fields} />
    </>
);