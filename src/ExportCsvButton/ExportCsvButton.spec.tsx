import { fireEvent, render } from '@testing-library/react';
import { ExportCsvButton } from './index';

describe('ExportCsvButton', () => {
    const noOp = () => {};

    it('renders the button with the provided text', () => {
        const { getByText } = render(<ExportCsvButton text='Export CSV' onClick={noOp} />);
        expect(getByText('Export CSV')).toBeInTheDocument();
    });

    it('renders the button with the CloudArrowDown16Regular icon', () => {
        const { container } = render(<ExportCsvButton onClick={noOp} />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('calls the onClick function when clicked', () => {
        const handleClick = jest.fn();
        const { getByText } = render(<ExportCsvButton onClick={handleClick} />);
        fireEvent.click(getByText('Export'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
