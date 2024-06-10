import React from "react";
import { Title } from "@tremor/react";
import { defaultData, anotherDataSet } from "./data";
import { Table, TableColumn } from "../src";

const columns: TableColumn[] = [
    { label: 'Name', sortOrder: 1, sortDirection: 'asc' },
    { label: 'City', disableSearch: true, excludeFromSort: true, textAlign: 'left' },
    { label: 'Date', dataType: 'date' },
    { label: 'Age', dataType: 'days', sortOrder: 2, sortDirection: 'desc' },
    { label: 'Units', dataType: 'number', textAlign: 'center' },
    { label: 'Income', dataType: 'money', formatterOptions: { currency: 'EUR' } },
    { label: 'Margin', dataType: 'percentage', formatterOptions: { decimals: 1 } },
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
