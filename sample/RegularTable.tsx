import React from 'react';
import { Table, type TableColumn } from '../src';
import { anotherDataSet, defaultData } from './data';
import { Title } from '../src/TextElements';

const columns: TableColumn[] = [
    { label: 'Name', sortOrder: 1, sortDirection: 'asc' },
    { label: 'City', disableSearch: true, excludeFromSort: true, textAlign: 'left' },
    { label: 'Date', dataType: 'date' },
    { label: 'Age', dataType: 'days', sortOrder: 2, sortDirection: 'desc' },
    { label: 'Units', dataType: 'number', textAlign: 'center' },
    { label: 'Income', dataType: 'money', formatterOptions: { currency: 'EUR' } },
    { label: 'Gross Margin', dataType: 'financial', formatterOptions: { selector: 'Years' } },
    { label: 'Tenure', dataType: 'tenure' },
    { label: 'Expenses', dataType: 'money', formatterOptions: { showCurrency: true } },
    { label: 'Like Ice cream', dataType: 'boolean' },
    { label: 'Profile', dataType: 'link' },
    { label: 'Long text', dataType: 'paragraph' },
    { label: 'Fruits', dataType: 'list' },
];

const extraColumns: TableColumn[] = [
    { label: 'Name', dataType: 'link', sortOrder: 1, sortDirection: 'asc' },
    { label: 'City', disableSearch: true, excludeFromSort: true, textAlign: 'left' },
    { label: 'Date', dataType: 'date' },
];

const calculateFooter = (data: unknown[][]) => ['Total', '', String(data.length), '', '', '', '', '', '', '', '', ''];

export default ({ toggle }: { toggle: boolean }) => (
    <Table
        className='h-72'
        columns={toggle ? columns : extraColumns}
        rawData={toggle ? defaultData : anotherDataSet}
        searchable
        sortable
        exportCsv
        calculateFooter={calculateFooter}
    >
        <Title className='w-full'>Data Table</Title>
    </Table>
);
