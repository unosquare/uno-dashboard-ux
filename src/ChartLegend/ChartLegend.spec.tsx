import React from 'react';
import { render } from '@testing-library/react';
import { ChartLegendSettings, UnoChartTooltip, ChartLegendLabel, getLabel } from './index';
import { Color } from '@tremor/react';

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

describe('ChartLegendLabel', () => {
    const categoryColors = new Map<string, Color>();
    categoryColors.set('Category 1', 'red');
    categoryColors.set('Category 2', 'blue');

    const settings = {
        categoryColors,
        index: 0,
        category:
        {
            name: 'Category 1',
            value: 10,
        },
        getLabelFunc: getLabel(undefined),
    };

    it('renders the component', () => {
        const { container } = render(<ChartLegendLabel {...settings} />);
        expect(container.firstChild).toBeInTheDocument();
    });
});
