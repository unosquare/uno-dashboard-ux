import { render } from '@testing-library/react';
import React from 'react';
import { AwaitableMetric } from './index';

describe('AwaitableMetric', () => {
    it('renders a Metric with loading-shimmer class when children is null', () => {
        const { container } = render(<AwaitableMetric />);

        expect(container.firstChild).toHaveClass('loading-shimmer');
    });

    it('renders a Metric with loading-shimmer class when children is undefined', () => {
        const undefinedValue = undefined;
        const { container } = render(<AwaitableMetric>{undefinedValue}</AwaitableMetric>);

        expect(container.firstChild).toHaveClass('loading-shimmer');
    });

    it('renders a Metric with the provided className when children is not null', () => {
        const { container } = render(<AwaitableMetric className='my-class'>My Metric Value</AwaitableMetric>);
        expect(container).toHaveTextContent('My Metric Value');
    });
});
