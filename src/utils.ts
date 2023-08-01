import { formatter } from 'uno-js';
import { LegendFormatTypes } from './constants';

export const translateFormat = (format?: LegendFormatTypes) => {
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

export const formatTicks = (t: any, formatType: LegendFormatTypes) => {
    if (formatType === 'money') {
        if (t >= 1000000) return `${t / 1000000}M`;

        return t >= 1000 ? `${t / 1000}K` : formatter(t, 'money');
    }

    return formatter(t, translateFormat(formatType));
};
