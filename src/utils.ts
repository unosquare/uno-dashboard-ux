import { formatter, FormatTypes, isMoneyObject } from 'uno-js';
import { DataTypes, FinancialMetric, LegendFormatType, TableColumn, Tenure } from './constants';

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

export const isTenureObject = (value: unknown): value is Tenure => {
    if (typeof value !== 'object' || value === null) return false;

    return 'Months' in value;
};

export const isFinancialMetric = (value: unknown): value is FinancialMetric => {
    if (typeof value !== 'object' || value === null) return false;

    return 'GrossMargin' in value;
};

export const moneyToNumber = (value: unknown) => {
    if (typeof value === 'number') return value;

    if (isMoneyObject(value)) return value.Amount;

    return 0;
};
