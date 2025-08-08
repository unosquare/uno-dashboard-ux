import { render } from '@testing-library/react';
import { Footer, type FooterSettings } from './index';

describe('Footer', () => {
    const defaultProps: FooterSettings = {
        transparent: false,
        copyright: 'Copyright © Unosquare, LLC',
    };

    it('renders with default props', () => {
        const { getByText } = render(<Footer {...defaultProps} />);
        expect(getByText(String(defaultProps.copyright))).toBeInTheDocument();
    });

    it('renders with transparent background', () => {
        const { container } = render(<Footer {...defaultProps} transparent />);
        expect(container.firstChild).toHaveClass('bg-transparent');
    });

    it('renders with black text when transparent is true', () => {
        const { container } = render(<Footer {...defaultProps} transparent />);
        expect(container.firstChild).toHaveClass('text-black');
    });

    it('renders with white text when transparent is false', () => {
        const { container } = render(<Footer {...defaultProps} />);
        expect(container.firstChild).toHaveClass('text-white');
    });
});
