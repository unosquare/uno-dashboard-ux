import React from 'react';
import { render } from '@testing-library/react';
import { DataChart } from './index';
import { identity } from 'uno-js';

describe('DataChart', () => {
  it('renders without crashing', () => {
    render(<DataChart rawData={[]} dataCallback={identity} />);
  });
});