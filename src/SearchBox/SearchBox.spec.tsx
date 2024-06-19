import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { SearchBox } from './index';

describe('SearchBox', () => {
    it('renders with default props', () => {
        const { container } = render(<SearchBox search={() => {}} />);
        expect(container.querySelector('input')).toBeInTheDocument();
        expect(container.querySelector('input')).toHaveAttribute('placeholder', 'Search');
        expect(container.querySelector('input')).not.toBeDisabled();
    });

    it('renders with provided props', () => {
        const { container } = render(
            <SearchBox search={() => {}} placeholder='Test Placeholder' focus={true} disabled={true} />,
        );
        expect(container.querySelector('input')).toBeInTheDocument();
        expect(container.querySelector('input')).toHaveAttribute('placeholder', 'Test Placeholder');
        expect(container.querySelector('input')).toBeDisabled();
    });

    it('calls search function on input change', async () => {
        const searchMock = jest.fn();
        const { getByPlaceholderText } = render(<SearchBox search={searchMock} />);
        const input = getByPlaceholderText('Search');
        fireEvent.change(input, { target: { value: 'test' } });
        await waitFor(() => expect(searchMock).toHaveBeenCalledWith('test'));
    });

    it('disables input when disabled prop is true', () => {
        const { getByPlaceholderText } = render(<SearchBox search={() => {}} disabled={true} />);
        const input = getByPlaceholderText('Search');
        expect(input).toBeDisabled();
    });

    it('show the initial value', () => {
        const { getByPlaceholderText } = render(<SearchBox search={() => {}} initialValue='test' />);
        const input = getByPlaceholderText('Search');
        expect(input).toHaveValue('test');
    });
});
