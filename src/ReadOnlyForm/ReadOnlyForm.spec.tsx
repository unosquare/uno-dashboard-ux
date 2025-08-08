import { render, screen } from '@testing-library/react';
import { ReadOnlyForm } from '.';

describe('ReadOnlyForm', () => {
    it('renders the form with the provided data', () => {
        const formData = [
            {
                label: 'Name',
                value: 'John Doe',
            },
            {
                label: 'Email',
                value: 'john@doe.com',
            },
            {
                label: 'Age',
                value: 30,
            },
        ];

        render(<ReadOnlyForm initialData={formData} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@doe.com')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });
});
