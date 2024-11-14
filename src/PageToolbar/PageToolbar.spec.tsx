import { render } from '@testing-library/react';
import React from 'react';
import { BasicToolbar } from './index';

describe('BasicToolbar', () => {
    it('renders children', () => {
        const { getByText } = render(
            <BasicToolbar>
                <div>Child 1</div>
                <div>Child 2</div>
            </BasicToolbar>,
        );

        expect(getByText('Child 1')).toBeInTheDocument();
        expect(getByText('Child 2')).toBeInTheDocument();
    });
});
