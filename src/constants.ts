import type { Money } from 'uno-js';

export * from './colors';

export type ChartData = {
    name: string;
    value: number;
    subValue?: string | number;
};

export const DEFAULT_WIDTH = 400;
export const DEFAULT_HEIGHT = 300;
export const DEFAULT_MARGIN = 5;
export const DEFAULT_BAR_CATEGORY_GAP = '10%';
export const DEFAULT_BAR_GAP = 4;
export const DEFAULT_LAYOUT: 'horizontal' | 'vertical' = 'horizontal';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ChartDataV2 = Array<Record<string, any>>;

export type LegendFormatType = 'percentage' | 'money' | 'negative' | 'number' | 'decimal';

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
    | 'paragraph'
    | 'list'
    | 'financial'
    | 'tenure';

export type SortDirection = 'asc' | 'desc';

export enum FormFieldTypes {
    Text = 'text',
    Number = 'number',
    Date = 'date',
    Select = 'select',
    VirtualSelect = 'virtualselect',
    Checkbox = 'checkbox',
    TextArea = 'textarea',
    MultiSelect = 'multiselect',
    File = 'file',
}

export type ClassNameComponent = {
    className?: string;
};

export type DataComponent<TDataIn, TDataOut> = {
    rawData: TDataIn | undefined;
    dataCallback?: (data: TDataIn) => TDataOut;
};

export type ChartComponent<TDataIn, TDataOut> = DataComponent<TDataIn, TDataOut> &
    ClassNameComponent & {
        legendFormatType?: LegendFormatType;
    };

export type TableCellTypes =
    | string
    | number
    | Array<string>
    | Date
    | boolean
    | null
    | Money
    | FinancialMetric
    | Tenure
    | undefined;

export type TableCoordinate = {
    rowIndex: number;
    columnIndex: number;
};

export type HasLabel = { label: string };

export type TableColumn = HasLabel & {
    dataType?: DataTypes;
    sortOrder?: number;
    sortDirection?: SortDirection;
    disableSearch?: boolean;
    excludeFromSort?: boolean;
    textAlign?: TextAlign;
    render?: <TDataIn>(
        column: TableColumn,
        coordinate: TableCoordinate,
        cellValue: TableCellTypes,
        rawData: TDataIn,
        data: TableCellTypes[][],
    ) => React.JSX.Element;
    formatterOptions?: {
        keepFormat?: boolean;
        decimals?: number;
        nullValue?: string;
        currency?: string;
        showCurrency?: boolean;
        locale?: string;
        selector?: string;
    };
};

export type ReactSelectOption<T = number> = HasLabel & {
    value: T;
};

export type ReactSelectGroupOption = HasLabel & {
    options: ReactSelectOption[];
};

export type ReadOnlyFormField<T> = HasLabel & {
    value?: T;
};

export type FormField<T> = ReadOnlyFormField<T> & {
    name: string;
    type?: FormFieldTypes;
    options?: ReactSelectOption<string | number>[] | undefined | null;
    onChange?: (e: string) => void;
    disabled?: boolean;
    notRequired?: boolean;
    loading?: boolean;
};

export interface ReadOnlyFormSettings<T> {
    initialData: ReadOnlyFormField<T>[];
    columns?: number;
}

export type FinancialMetric = {
    Revenue: Money;
    Cost: Money;
    GrossProfit: Money;
    GrossMargin: number;
};

export type Tenure = {
    TotalDays: number;
    TotalMonths: number;
    TotalYears: number;
    Days: number;
    Months: number;
    Years: number;
    StartDate: Date;
    EndDate?: Date | null;
};

export type ButtonVariant = 'primary' | 'secondary' | 'light';

export type HorizontalPosition = 'left' | 'right';

export type VerticalPosition = 'top' | 'bottom';

export const HorizontalPositions: { [key: string]: HorizontalPosition } = {
    Left: 'left',
    Right: 'right',
};

export const VerticalPositions: { [key: string]: VerticalPosition } = {
    Top: 'top',
    Bottom: 'bottom',
};

const sizeValues = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type Size = (typeof sizeValues)[number];

export const Sizes: { [key: string]: Size } = {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
};

const deltaTypeValues = ['increase', 'moderateIncrease', 'decrease', 'moderateDecrease', 'unchanged'] as const;

export type DeltaType = (typeof deltaTypeValues)[number];

export const DeltaTypes: { [key: string]: DeltaType } = {
    Increase: 'increase',
    ModerateIncrease: 'moderateIncrease',
    Decrease: 'decrease',
    ModerateDecrease: 'moderateDecrease',
    Unchanged: 'unchanged',
};

export type BadgeProportionTypes = {
    paddingX: string;
    paddingY: string;
    fontSize: string;
};
