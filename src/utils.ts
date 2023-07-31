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
