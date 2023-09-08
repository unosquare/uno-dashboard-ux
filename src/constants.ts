import { Color } from '@tremor/react';

export type ChartData = {
    name: string;
    value: number;
    subValue?: string | number;
};

export type LegendFormatType = 'percentage' | 'money' | 'negative' | 'number';

export type ChartTooltipType = 'classic' | 'tremor';

export type TextAlign = 'left' | 'center' | 'right';

export type DataTypes =
    | 'money'
    | 'decimal'
    | 'number'
    | 'string'
    | 'percentage'
    | 'date'
    | 'days'
    | 'months'
    | 'boolean'
    | 'link'
    | 'bullet'
    | 'paragraph';

export type SortDirection = 'asc' | 'desc';

export type ChartComponent<TDataIn, TDataOut> = {
    colors?: Color[];
    legendFormatType?: LegendFormatType;
    rawData?: TDataIn;
    dataCallback?: (data: TDataIn) => TDataOut;
    className?: string;
};
