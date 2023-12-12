import React from 'react';
import { getAlignment, getColumnSorting, renderTableCell, Table, TableCellTypes, TableColumn } from './index';
import { render } from '@testing-library/react';

describe('getAlignment', () => {
    it('returns text-left for paragraph data type', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'paragraph' };
        expect(getAlignment(tableColumn)).toBe('text-left');
    });

    it('returns text-left for first column of left-aligned data types', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'string' };
        expect(getAlignment(tableColumn, 0)).toBe('text-left');
    });

    it('returns text-center for right-aligned data types', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'number' };
        expect(getAlignment(tableColumn)).toBe('text-right');
    });

    it('returns text-right for right-aligned data types', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'money' };
        expect(getAlignment(tableColumn)).toBe('text-right');
    });

    it('returns custom text alignment class when provided', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'number', textAlign: 'center' };
        expect(getAlignment(tableColumn)).toBe('text-center');
    });
});

describe('getColumnSorting', () => {
    it('returns 1 when the column is sortable', () => {
        const tableColumn: TableColumn[] = [{ label: 'column', sortOrder: 1, sortDirection: 'asc' }];
        expect(getColumnSorting(tableColumn, 0)[0].sortOrder).toBe(1);
        expect(getColumnSorting(tableColumn, 0)[0].sortDirection).toBe('desc');
    });
});

describe('renderTableCell', () => {
    it('renders a paragraph when the data type is paragraph', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'paragraph' };
        const cellValue = 'This is a paragraph';
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container).toHaveTextContent(cellValue);
    });

    it('renders a string when the data type is string', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'string' };
        const cellValue = 'This is a string';
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container).toHaveTextContent(cellValue);
    });

    it('renders a number when the data type is number', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'number' };
        const cellValue = 123;
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container).toHaveTextContent(cellValue.toString());
    });

    it('renders a money when the data type is money', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'money' };
        const cellValue = 123;
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container).toHaveTextContent('$123.00');
    });

    it('renders a date when the data type is date', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'date' };
        const cellValue = new Date(2020, 0, 1);
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container).toHaveTextContent('1/1/2020');
    });

    it('renders a link when the data type is link', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'link' };
        const cellValue = 'https://www.unosquare.com';
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container.querySelector('a')).toBeInTheDocument();
    });

    it('renders a checkbox image when the data type is boolean', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'boolean' };
        const cellValue = true;
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders a bullet image when the data type is bullet', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'bullet' };
        const cellValue = true;
        const { container } = render(<>{renderTableCell(cellValue, tableColumn)}</>);
        expect(container.querySelector('span')).toBeInTheDocument();
    });
});

describe('Table', () => {
    const tableColumns: TableColumn[] = [
        { label: 'Column 1', dataType: 'string', sortOrder: 1, sortDirection: 'asc' },
        { label: 'Column 2', dataType: 'number', sortOrder: 2, sortDirection: 'desc' },
        { label: 'Column 3', dataType: 'money' },
        { label: 'Column 4', dataType: 'date' },
        { label: 'Column 5', dataType: 'link', excludeFromSort: true },
        { label: 'Column 6', dataType: 'boolean' },
        { label: 'Column 7', dataType: 'months' },
        { label: 'Column 8', dataType: 'percentage' },
        { label: 'Column 9', dataType: 'decimal' },
    ];

    const tableData = [
        ['Row 1', 1, 1, new Date(2020, 0, 1), 'https://www.unosquare.com', true, 1, 100, 0.1],
        ['Row 2', 2, 2, new Date(2020, 0, 2), ['https://www.unosquare.com', 'OK', 'Link'], false, 1, 100, 0.1],
        ['Row 3', 3, 3, new Date(2020, 0, 3), 'https://www.unosquare.com', true, 1, 0, 0.1],
        ['Row 4', 4, 4, new Date(2020, 0, 4), 'https://www.unosquare.com', false, 1, 0, 0.1],
        ['Row 5', 5, 5, new Date(2020, 0, 5), 'https://www.unosquare.com', true, 2, 50, 0.1],
        ['Row 6', 6, 6, new Date(2020, 0, 6), 'https://www.unosquare.com', false, 2, 30, 0.1],
        ['Row 7', 7, 7, new Date(2020, 0, 7), 'https://www.unosquare.com', true, 2, 30, 0.1],
        ['Row 8', 8, 8, new Date(2020, 0, 8), 'https://www.unosquare.com', false, 2, 10, 0.1],
        ['Row 9', 9, 9, new Date(2020, 0, 9), 'https://www.unosquare.com', true, 3, 10, 0.1],
        ['Row 10', 10, 10, new Date(2020, 0, 10), 'https://www.unosquare.com', false, 3, 10, 0.1],
    ];

    it('renders without crashing', () => {
        render(<Table columns={tableColumns} rawData={tableData} />);
    });

    it('renders with shimmer', () => {
        const data: undefined | TableCellTypes[][] = undefined;
        const { container } = render(<Table columns={tableColumns} rawData={data} dataCallback={(x: undefined | TableCellTypes[][]) => []} />);

        const shimmer = container.querySelector('.loading-shimmer');
        expect(shimmer).toBeInTheDocument();
    });

    it('renders the correct number of rows', () => {
        const { container } = render(<Table columns={tableColumns} rawData={tableData} />);
        const rows = container.querySelectorAll('tbody .tremor-TableRow-row');
        expect(rows.length).toBe(tableData.length);
    });

    it('renders the correct number of headers', () => {
        const { container } = render(<Table columns={tableColumns} rawData={tableData} />);
        const headers = container.querySelectorAll('.tremor-TableHeaderCell-root');
        expect(headers.length).toBe(tableColumns.length);
    });


    it('renders the correct number of footer', () => {
        const { container } = render(<Table columns={tableColumns} rawData={tableData} calculateFooter={() => Array.from({ length: tableColumns.length }).map(() => '')} />);
        const headers = container.querySelectorAll('.tremor-TableFooterCell-root');
        expect(headers.length).toBe(tableColumns.length);
    });
});