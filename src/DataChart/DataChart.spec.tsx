import React from 'react';
import { render } from '@testing-library/react';
import { DataChart } from './index';
import { identity } from 'uno-js';

describe('DataChart', () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
  ];

  it('renders without crashing', () => {
    render(<DataChart rawData={[]} dataCallback={identity} />);
  });

  it('renders the no data legend', () => {
    const { getByText } = render(<DataChart rawData={[]} dataCallback={identity} />);
    expect(getByText('No record found')).toBeInTheDocument();
  });

  it('renders the chart', () => {
    const { container } = render(<DataChart rawData={data} dataCallback={identity} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});