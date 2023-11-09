import React from 'react';
import { render } from '@testing-library/react';
import { PieChart } from './index';
import { identity } from 'uno-js';

describe('PieChart', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    const dataStore = [
        { name: 'Category 1', value: 10 },
        { name: 'Category 2', value: 20 },
        { name: 'Category 3', value: 30 },
    ];

    it('renders a pie chart with the correct number of slices', () => {
        const { container } = render(<PieChart rawData={dataStore} dataCallback={identity} />);

        const slices = container.querySelectorAll('.recharts-pie-sector');
        expect(slices.length).toBe(dataStore.length);
    });
});
