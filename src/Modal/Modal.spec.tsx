import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Modal } from './index';

describe('Modal', () => {
    it('renders children', () => {
        const { getByText } = render(<Modal onClose={jest.fn()}>My Modal</Modal>);
        expect(getByText('My Modal')).toBeInTheDocument();
    });

    it('adds overflow-hidden class to body on mount', () => {
        render(<Modal onClose={jest.fn()}>My Modal</Modal>);
        expect(document.body.classList.contains('overflow-hidden')).toBe(true);
    });

    it('removes overflow-hidden class from body on unmount', () => {
        const { unmount } = render(<Modal onClose={jest.fn()}>My Modal</Modal>);
        unmount();
        expect(document.body.classList.contains('overflow-hidden')).toBe(false);
    });
});
