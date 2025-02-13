import React from 'react';
import { ReadOnlyForm } from '../src';
import { Title } from '../src/TextElements';

const fields = [
    {
        label: 'Name',
        value: 'John Doe',
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
