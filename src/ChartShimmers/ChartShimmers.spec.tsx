import React from 'react';
import { render } from '@testing-library/react';
import { ChartBarShimmer, ChartLineShimmer } from './index';

describe('ChartBarShimmer', () => {
    it('renders without crashing', () => {
        const { container } = render(<ChartBarShimmer />);
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toHaveClass('w-full');
    });
});

describe('ChartLineShimmer', () => {
    it('renders without crashing', () => {
        const { container } = render(<ChartLineShimmer />);
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toHaveClass('w-full');
    });
});
