import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from '../Form';
import { FormFieldTypes } from '../constants';

describe('Form', () => {
    it('displays the correct initial values', () => {
        const formData = [
            {
                label: 'Name',
                name: 'name',
                value: 'John Doe',
            },
            {
                label: 'Email',
                name: 'email',
                value: 'john@doe.com',
            },
            {
                label: 'Age',
                name: 'age',
                type: FormFieldTypes.Number,
                value: '30',
            },
        ];

        const saveMock = jest.fn();

        const onSave = (data: any) =>{
            saveMock(data);
            return Promise.resolve();
        } 

        render(<Form initialData={formData} onSave={onSave} />);

        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john@doe.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });
});
