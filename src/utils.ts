import { FormatTypes } from 'uno-js';
import { LegendFormatTypes } from './constants';

export const translateFormat = (format?: LegendFormatTypes) => {
    switch (format) {
        case LegendFormatTypes.MONEY:
            return FormatTypes.MONEY;
        case LegendFormatTypes.PERCENTAGE:
            return FormatTypes.PERCENTAGE;
        case LegendFormatTypes.NUMBER:
        case LegendFormatTypes.NEGATIVE:
            return FormatTypes.NUMBER;
        default:
            return FormatTypes.DECIMAL;
    }
};
