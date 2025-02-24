import { render, screen } from '@testing-library/react';
import React from 'react';
import { NoData } from './index';

describe('NoData component', () => {
    it('renders "No record found" when no children are provided', () => {
        render(<NoData />);
        expect(screen.getByText('No record found')).toBeInTheDocument();
    });

    it('renders children when provided', () => {
        render(<NoData>Test Child</NoData>);
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
});
