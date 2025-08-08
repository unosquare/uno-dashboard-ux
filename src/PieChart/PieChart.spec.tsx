import { render } from '@testing-library/react';
import { PieChart } from './index';

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
        const { container } = render(<PieChart rawData={dataStore} />);

        const slices = container.querySelectorAll('.recharts-pie-sector');
        expect(slices.length).toBe(dataStore.length);
    });

    it('renders loading', () => {
        const undefinedValue: number[] | undefined = undefined;
        const callback = (_data: number[]) => [];

        const { container } = render(<PieChart rawData={undefinedValue} dataCallback={callback} />);

        expect(container.querySelector('.loading-shimmer')).toBeInTheDocument();
    });

    it('renders the no data legend', () => {
        const { getByText } = render(<PieChart rawData={[]} />);
        expect(getByText('No record found')).toBeInTheDocument();
    });
});
