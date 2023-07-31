export type ChartTypes = 'pie' | 'funnel' | 'line' | 'bar';

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
    | 'location'
    | 'days'
    | 'months'
    | 'boolean'
    | 'link'
    | 'bullet'
    | 'paragraph'
    | 'file';

export type SortDirection = 'asc' | 'desc';

export interface ChartComponent<TDataIn, TDataOut> {
    colors?: string[];
    legendFormatType?: LegendFormatTypes;
    rawData?: TDataIn;
    dataCallback?: (data: TDataIn) => TDataOut;
}

export type HasChildrenComponent = {
    children?: React.ReactNode;
};
