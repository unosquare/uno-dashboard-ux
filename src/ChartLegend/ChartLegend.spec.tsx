import React from 'react';
import { render } from '@testing-library/react';
import { ChartLegendSettings, UnoChartTooltip } from './index';

describe('UnoChartTooltip', () => {
    const settings: ChartLegendSettings = {
        categoryColors: new Map(),
        active: true,
        payload: [
            {
                name: 'Category 1',
                value: 10,
            },
            {
                name: 'Category 2',
                value: 20,
            },
        ],
    };

    it('renders the component', () => {
        const { container } = render(<UnoChartTooltip {...settings} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders the correct number of categories', () => {
        const { container } = render(<UnoChartTooltip {...settings} />);
        const categories = container.querySelectorAll('.gap-2');
        expect(categories.length).toBe(settings.payload?.length);
    });

    it('renders the correct category names', () => {
        const { getByText } = render(<UnoChartTooltip {...settings} />);
        settings.payload?.forEach((category) => {
            expect(getByText(category.name!)).toBeInTheDocument();
        });
    });

    it('renders the correct category values', () => {
        const { getByText } = render(<UnoChartTooltip {...settings} />);
        settings.payload?.forEach((category) => {
            expect(getByText(String(category.value!))).toBeInTheDocument();
        });
    });
});
