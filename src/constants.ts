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

export type TableCellTypes = string | number | Array<string> | Date | boolean | null | undefined;

export type TableCoordinate = {
    rowIndex: number;
    columnIndex: number;
};

export type TableColumn = {
    label: string;
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
    };
};

export type ReactSelectOption<T = number> = {
    value: T;
    label: string;
};

export type ReactSelectGroupOption = {
    label: string;
    options: ReactSelectOption[];
};

export interface FormField<T> {
    name: string;
    label: string;
    value?: T;
    type?: FormFieldTypes;
    options?: ReactSelectOption<string | number>[] | undefined;
    onChange?: (e: string) => void;
    disabled?: boolean;
    notRequired?: boolean;
    loading?: boolean;
}
