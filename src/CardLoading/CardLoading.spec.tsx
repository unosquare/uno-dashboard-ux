import { render } from '@testing-library/react';
import React from 'react';
import { CardLoading } from './index';

describe('CardLoading', () => {
    it('renders without crashing', () => {
        const { container } = render(<CardLoading />);
        expect(container.firstChild).toBeInTheDocument();
    });
});
