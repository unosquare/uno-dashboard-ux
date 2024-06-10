import { Money } from "uno-js";

export type ChartData = {
    name: string;
    value: number;
    subValue?: string | number;
};

export type LegendFormatType = 'percentage' | 'money' | 'negative' | 'number';

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

export enum FormFieldTypes {
    Text = 'text',
    Number = 'number',
    Date = 'date',
    Select = 'select',
    VirtualSelect = 'virtualselect',
    Checkbox = 'checkbox',
    TextArea = 'textarea',
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

export type TableCellTypes = string | number | Array<string> | Date | boolean | null | Money | undefined;

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
    ) => JSX.Element;
    formatterOptions?: {
        keepFormat?: boolean;
        decimals?: number;
        nullValue?: string;
        currency?: string;
        showCurrency?: boolean;
        locale?: string;
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
