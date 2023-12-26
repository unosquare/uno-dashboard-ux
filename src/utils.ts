import { formatter, FormatTypes } from 'uno-js';
import { DataTypes, LegendFormatType, TableColumn } from './constants';

const leftAlign: Array<DataTypes | undefined> = ['string', 'link', 'bullet', undefined];
const rightAlign: Array<DataTypes | undefined> = ['decimal', 'number', 'money'];

export const getAlignment = (tableColumn: TableColumn, index?: number) => {
    if (tableColumn.textAlign) return `text-${tableColumn.textAlign.toLowerCase()}`;

    const { dataType } = tableColumn;
    if (dataType === 'paragraph' || (leftAlign.includes(dataType) && index === 0)) return 'text-left';

    return rightAlign.includes(dataType) ? 'text-right' : 'text-center';
};

export const translateType = (type: DataTypes | undefined): FormatTypes | undefined => {
    switch (type) {
        case 'date':
            return 'date';
        case 'money':
            return 'money';
        case 'percentage':
            return 'percentage';
        case 'days':
            return 'days';
        case 'months':
            return 'months';
        case 'decimal':
            return 'decimal';
        default:
            return undefined;
    }
};

export const translateFormat = (format?: LegendFormatType) => {
    switch (format) {
        case 'money':
            return 'money';
        case 'percentage':
            return 'percentage';
        case 'number':
        case 'negative':
            return 'number';
        default:
            return 'decimal';
    }
};

export const formatTicks = (t: number, formatType: LegendFormatType) => {
    if (formatType === 'money') {
        if (t >= 1000000) return `${t / 1000000}M`;

        const result = t >= 1000 ? `${t / 1000}K` : formatter(t, 'money');

        return result ?? String(t);
    }

    return formatter(t, translateFormat(formatType)) ?? String(t);
};

export const getValueFormatted = (value: number, legendFormatType?: LegendFormatType) => {
    if (legendFormatType === 'money' || legendFormatType === 'percentage')
        return formatter(value, translateFormat(legendFormatType)) ?? String(value);

    return `${legendFormatType === 'negative' ? value : Math.abs(value)}`;
};
