export enum Directions {
    COLUMN = 'column',
    ROW = 'row',
}

export enum FlexValues {
    START = 'start',
    CENTER = 'center',
    END = 'end',
}

export enum SizeValues {
    LARGE = 'lg',
    MEDIUM = 'md',
    MEDIUM_INTER = 'mi',
    SMALL = 'sm',
    SMALL_INTER = 'si',
    EXTRA_SMALL = 'xs',
    MICRO = 'mc',
    LARGE_PADDED = 'lp',
}

export enum Colors {
    BLUE = 'blue',
    GRAY = 'gray',
    CELL_BACKGROUND = '#F1F2F3',
    CELL_TEXT = '#6E6F6F',
    BORDER_GRAY = '#C7C7C7',
    VALID_CELL_DATA = '#2FAA90',
    INVALID_CELL_DATA = 'red',
}

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
    NORMAL = 'normal',
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
    DECIMAL_PERCENTAGE = 'decimalPpercentage',
    LINK = 'link',
    DATE = 'date',
    DATE_LOCAL = 'dateLocal',
    LOCATION = 'location',
    DAYS = 'days',
    MONTHS = 'months',
    BOOLEAN = 'boolean',
    LINK_STRING = 'linkString',
    LINK_ICON = 'linkIcon',
    BULLET = 'bullet',
    PARAGRAPH = 'paragraph',
    BOLD_STRING = 'boldstring',
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export interface CurrencyRate {
    CurrencyRateId: number;
    CurrencyCode: string;
    RateToUsd: number;
    DateModified: string;
}
