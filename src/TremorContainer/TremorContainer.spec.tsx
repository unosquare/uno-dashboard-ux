import React from 'react';
import { render } from '@testing-library/react';
import { TremorContainer } from './index';

describe('TremorContainer', () => {
    it('renders children', () => {
        const { getByText } = render(<TremorContainer>My TremorContainer</TremorContainer>);
        expect(getByText('My TremorContainer')).toBeInTheDocument();
    });

    it('renders children inside a div with max-w-unomax and m-auto classes', () => {
        const { container } = render(<TremorContainer>My TremorContainer</TremorContainer>);
        const div = container.querySelector('div');
        expect(div).toHaveClass('max-w-unomax');
        expect(div).toHaveClass('m-auto');
    });
});
