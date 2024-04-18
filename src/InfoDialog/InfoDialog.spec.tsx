import React from 'react';
import { render, screen } from '@testing-library/react';
import { InfoDialog, InfoDialogTitle } from './index';

describe('InfoDialog', () => {
    test('renders InfoDialog component', () => {
        render(<InfoDialog />);
        expect(screen.getByTitle('Info')).toBeInTheDocument();
    });
});

describe('InfoDialogTitle', () => {
    test('renders InfoDialogTitle component', () => {
        render(<InfoDialogTitle>InfoDialogTitle</InfoDialogTitle>);
        expect(screen.getByText('InfoDialogTitle')).toBeInTheDocument();
    });
});