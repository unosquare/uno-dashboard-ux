import React from 'react';
import { render } from '@testing-library/react';
import { ChartBar, ChartBarSettings } from './index';
import { identity } from 'uno-js';

describe('ChartBar', () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
  ];

  const settings: ChartBarSettings<{ name: string, value: number }[]> = {
    rawData: data,
    dataCallback: identity,
    legendFormatType: 'number',
    legend: true,
    refLineY: { value: 50, label: 'Ref Line', color: 'red' },
  };

  it('renders without crashing', () => {
    render(<ChartBar rawData={data} dataCallback={identity} />);
  });

  it('renders the legend', () => {
    const { getByText } = render(<ChartBar {...settings} />);
    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('C')).toBeInTheDocument();
  });

  xit('renders the ref line', () => {
    const { getByText } = render(<ChartBar {...settings} />);
    expect(getByText('Ref Line')).toBeInTheDocument();
  });
  
  it('renders loading', () => {
    const undefinedValue: number[] | undefined = undefined;
    const callback = (data: number[]) => [];

    const { container } = render(<ChartBar rawData={undefinedValue} dataCallback={callback} />);

    expect(container.querySelector('.loading-shimmer')).toBeInTheDocument();
  });

  it('renders the no data legend', () => {
    const { getByText } = render(<ChartBar rawData={[]} dataCallback={identity} />);
    expect(getByText('No record found')).toBeInTheDocument();
  });
});