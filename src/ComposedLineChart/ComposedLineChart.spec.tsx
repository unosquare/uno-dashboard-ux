import { render } from '@testing-library/react';
import { ComposedLineChart } from './index';

describe('ComposedLineChart', () => {
    const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 30 },
    ];

    it('renders without crashing', () => {
        render(<ComposedLineChart rawData={data} lines={[{ dataKey: 'name', yAxisId: 'left' }]} />);
    });

    it('renders the no data legend', () => {
        const { getByText } = render(<ComposedLineChart rawData={[]} lines={[{ dataKey: 'name', yAxisId: 'left' }]} />);
        expect(getByText('No record found')).toBeInTheDocument();
    });
});
