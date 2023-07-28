export enum ChartTypes {
    PIE = 'pie',
    FUNNEL = 'funnel',
    LINE = 'line',
    BAR = 'bar',
}

export interface ChartData {
    name: string;
    value: number;
    subValue?: string | number;
}

export enum LegendFormatTypes {
    PERCENTAGE = 'percentage',
    MONEY = 'money',
    TENURE = 'tenure',
    NEGATIVE = 'negative',
    NUMBER = 'number',
}

export enum DataTypes {
    MONEY = 'money',
    DECIMAL = 'decimal',
    NUMBER = 'number',
    STRING = 'string',
    PERCENTAGE = 'percentage',
    DATE = 'date',
    LOCATION = 'location',
    DAYS = 'days',
    MONTHS = 'months',
    BOOLEAN = 'boolean',
    LINK = 'link',
    BULLET = 'bullet',
    PARAGRAPH = 'paragraph',
    BOLD_STRING = 'boldstring',
    FILE = 'file',
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export interface ChartComponent<TDataIn, TDataOut> {
    colors?: string[];
    legendFormatType?: LegendFormatTypes;
    rawData?: TDataIn;
    dataCallback?: (data: TDataIn) => TDataOut;
}

export interface HasChildrenComponent {
    children?: React.ReactNode;
}
