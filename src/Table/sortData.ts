import { DataTypes, SortDirection } from '../constants';

export type TableColumn = {
    label: string;
    dataType?: DataTypes;
    sortOrder?: number;
    sortDirection?: SortDirection;
    disableSearch?: boolean;
    excludeFromSort?: boolean;
    formatterOptions?: {
        keepFormat?: boolean;
        decimals?: number;
        nullValue?: string;
    };
};

export const defaultFilter = (search: string) => (element: any) =>
    element && element.toString().toLowerCase().match(search.toLowerCase());

export const searchData = <TDataOut extends Array<unknown>>(
    search: string | undefined,
    newData: TDataOut[],
    definitions: TableColumn[],
) => {
    if (!search) return newData;

    const ignoreColumns = definitions
        .filter((y) => y.disableSearch === true)
        .map((x) => definitions.findIndex((z) => z.label === x.label));

    return newData.filter((section: any[]) =>
        section.filter((_, i) => !ignoreColumns.includes(i)).some(defaultFilter(search)),
    );
};

const sanitizeNumericString = (str: string) =>
    Number(str.replaceAll(',', '').replaceAll('$', '').replaceAll('%', '').trim());

const compareDates = (date1: unknown, date2: unknown) =>
    new Date(date1 as any).getTime() - new Date(date2 as any).getTime();

const numericTypes: DataTypes[] = ['number', 'decimal', 'percentage', 'money', 'days', 'months', 'boolean'];

const sortComparer = (left: string, right: string) =>
    left.trim().localeCompare(right.trim(), undefined, { numeric: true, sensitivity: 'base' });

const checkNumericString = (a: string, b: string) => {
    if ((a.includes('$') && b.includes('$')) || (a.includes('%') && b.includes('%'))) {
        const numStrA = sanitizeNumericString(a);
        const numStrB = sanitizeNumericString(b);

        if (typeof numStrA === 'number' && typeof numStrB === 'number') {
            const result = numStrA - numStrB;
            if (result !== 0) return result;
        }
    }

    return sortComparer(a, b);
};

const sortOneColumn = <T extends TableColumn, TDataOut extends Array<unknown>>(
    left: TDataOut,
    right: TDataOut,
    { sortOrder, dataType, sortDirection }: T,
    getSortIndex: (order: number) => number,
) => {
    const sortColumn = getSortIndex(sortOrder ?? 0);

    if (left[sortColumn] === null) return 1;
    if (right[sortColumn] === null) return -1;

    const a = sortDirection === 'desc' ? right : left;
    const b = sortDirection === 'desc' ? left : right;

    if (dataType === 'link')
        return sortComparer((a[sortColumn] as Array<string>)[1], (b[sortColumn] as Array<string>)[1]);

    if (dataType === 'date') {
        const result = compareDates(a[sortColumn], b[sortColumn]);

        if (result !== 0) return result;
    }

    if (numericTypes.includes(dataType ?? 'string')) {
        const result = Number(a[sortColumn]) - Number(b[sortColumn]);

        if (result !== 0) return result;
    }

    return checkNumericString(String(a[sortColumn]), String(b[sortColumn]));
};

export const sortData = <TDataOut extends Array<unknown>, T extends TableColumn>(
    data: TDataOut[],
    definition: T[],
    getSortIndex?: (order: number) => number,
) => {
    data.sort((left: TDataOut, right: TDataOut) => {
        const sortColumns = definition
            .filter((x) => x.sortOrder && x.sortOrder >= 1)
            .sort((x, y) => Number(x.sortOrder) - Number(y.sortOrder));

        const sorter = getSortIndex || ((sortOrder: number) => definition.findIndex((x) => x.sortOrder === sortOrder));

        for (let i = 0; i < sortColumns.length; i++) {
            const result = sortOneColumn(left, right, sortColumns[i], sorter);
            if (result !== 0) return result;
        }

        return 0;
    });

    return data;
};
