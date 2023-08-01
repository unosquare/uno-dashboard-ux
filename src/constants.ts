export type ChartTypes = 'pie' | 'line' | 'bar';

export type ChartData = {
    name: string;
    value: number;
    subValue?: string | number;
};

export type LegendFormatTypes = 'percentage' | 'money' | 'tenure' | 'negative' | 'number';

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
    colors?: string[];
    legendFormatType?: LegendFormatTypes;
    rawData?: TDataIn;
    dataCallback?: (data: TDataIn) => TDataOut;
};

export type HasChildrenComponent = {
    children?: React.ReactNode;
};
