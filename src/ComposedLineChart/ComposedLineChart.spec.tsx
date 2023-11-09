import React from 'react';
import { render } from '@testing-library/react';
import { ComposedLineChart } from './index';
import { identity } from 'uno-js';

describe('ComposedLineChart', () => {
    const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 30 },
    ];

    it('renders without crashing', () => {
        render(<ComposedLineChart rawData={data} dataCallback={identity} lines={[{ dataKey: 'name', yAxisId: 'left' }]} />);
    });
});