import { formatter } from 'uno-js';
import { LegendFormatType } from './constants';

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
