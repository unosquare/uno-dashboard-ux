import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import HorizontalSelector from './index';

describe('HorizontalSelector Component', () => {
    const mockOnValueChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the label and children correctly', () => {
        render(
            <HorizontalSelector label='Test Label' onValueChange={mockOnValueChange}>
                <span>Child Content</span>
            </HorizontalSelector>,
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    test('calls onValueChange with false when left chevron is clicked', () => {
        render(
            <HorizontalSelector label='Test Label' onValueChange={mockOnValueChange}>
                <span>Child Content</span>
            </HorizontalSelector>,
        );

        const leftChevron = screen.getByTestId('left-chevron');
        fireEvent.click(leftChevron);

        expect(mockOnValueChange).toHaveBeenCalledWith(false);
    });

    test('calls onValueChange with true when right chevron is clicked', () => {
        render(
            <HorizontalSelector label='Test Label' onValueChange={mockOnValueChange}>
                <span>Child Content</span>
            </HorizontalSelector>,
        );

        const rightChevron = screen.getByTestId('right-chevron');
        fireEvent.click(rightChevron);

        expect(mockOnValueChange).toHaveBeenCalledWith(true);
    });
});
