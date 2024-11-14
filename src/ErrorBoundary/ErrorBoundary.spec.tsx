import { render } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from './index';

describe('ErrorBoundary', () => {
    it('renders children when no error is thrown', () => {
        const { getByText } = render(
            <ErrorBoundary>
                <div>My Component</div>
            </ErrorBoundary>,
        );
        expect(getByText('My Component')).toBeInTheDocument();
    });

    it('renders an error message when an error is thrown', () => {
        const ThrowError = () => {
            throw new Error('Test Error');
        };
        const { getByText } = render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>,
        );
        expect(getByText('Oops, something went wrong')).toBeInTheDocument();
        expect(getByText('Please refresh the page and try again')).toBeInTheDocument();
    });
});
