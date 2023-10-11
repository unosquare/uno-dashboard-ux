import { formatter } from 'uno-js';
import { LegendFormatType } from './constants';

export type DataComponent<TDataIn, TDataOut> = {
    rawData: TDataIn | undefined;
    dataCallback: (data: TDataIn) => TDataOut;
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

        return t >= 1000 ? `${t / 1000}K` : formatter(t, 'money');
    }

    return formatter(t, translateFormat(formatType));
};

export const getValueFormatted = (value: number, legendFormatType?: LegendFormatType) => {
    if (legendFormatType === 'money' || legendFormatType === 'percentage')
        return formatter(value, translateFormat(legendFormatType));

    return `${legendFormatType === 'negative' ? value : Math.abs(value)}`;
};
