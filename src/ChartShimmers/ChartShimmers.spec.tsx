import React from 'react';
import { render } from '@testing-library/react';
import { ChartBarShimmer, ChartLineShimmer } from './index';

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));
});

afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
});

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
