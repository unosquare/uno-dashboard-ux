import { render } from '@testing-library/react';
import React from 'react';
import { VirtualSelect } from './index';

describe('VirtualSelect', () => {
    const options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];

    it('renders with default props', () => {
        const { queryByPlaceholderText } = render(<VirtualSelect onValueChange={jest.fn} options={options} />);
        expect(queryByPlaceholderText('Select...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
        const { queryByPlaceholderText } = render(
            <VirtualSelect onValueChange={jest.fn} options={options} placeholder='Custom Placeholder' />,
        );
        expect(queryByPlaceholderText('Custom Placeholder')).toBeInTheDocument();
    });

    it('renders with disabled state', () => {
        const { getByRole } = render(<VirtualSelect onValueChange={jest.fn} options={options} disabled />);
        const select = getByRole('combobox');
        expect(select).toBeDisabled();
    });

    it('renders with clear button', () => {
        const { container } = render(<VirtualSelect onValueChange={jest.fn} options={options} enableClear />);
        const clearButton = container.querySelector('button');
        expect(clearButton).toBeInTheDocument();
    });
});
