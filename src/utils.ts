import { type FormatTypes, formatter, isMoneyObject, toMoney } from 'uno-js';
import type { DataTypes, FinancialMetric, LegendFormatType, TableColumn, Tenure } from './constants';

const leftAlign: Array<DataTypes | undefined> = ['string', 'link', 'bullet', undefined];
const rightAlign: Array<DataTypes | undefined> = ['decimal', 'number', 'money'];

export const getAlignment = (tableColumn?: TableColumn, index?: number) => {
    if (!tableColumn) return '';
    
    if (tableColumn.textAlign) return `text-${tableColumn.textAlign.toLowerCase()}`;

    const { dataType } = tableColumn;

    if (dataType === 'paragraph' || (leftAlign.includes(dataType) && index === 0)) return 'text-left';

    return rightAlign.includes(dataType) ? 'text-right' : 'text-center';
};

const typeToFormatMap: Record<DataTypes, FormatTypes | undefined> = {
    date: 'date',
    money: 'money',
    percentage: 'percentage',
    days: 'days',
    months: 'months',
    decimal: 'decimal',
    number: 'number',
    string: undefined,
    link: undefined,
    bullet: undefined,
    paragraph: undefined,
    list: undefined,
    boolean: undefined,
    financial: undefined,
    tenure: undefined,
};

export const translateType = (type: DataTypes | undefined): FormatTypes | undefined =>
    type ? typeToFormatMap[type] : undefined;

const legendFormatTypeToFormatMap: Record<LegendFormatType, FormatTypes> = {
    money: 'money',
    percentage: 'percentage',
    number: 'number',
    negative: 'number',
    decimal: 'decimal',
};

export const translateFormat = (format?: LegendFormatType) =>
    format ? legendFormatTypeToFormatMap[format] : 'decimal';

export const formatTicks = (t: number, formatType: LegendFormatType) => {
    if (formatType === 'money') {
        if (t >= 1000000) return `${t / 1000000}M`;

        const result = t >= 1000 ? `${t / 1000}K` : toMoney(t);

        return result ?? String(t);
    }

    return formatter(t, translateFormat(formatType), { nullValue: '0' }) ?? String(t);
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

    return isMoneyObject(value) ? value.Amount : 0;
};
