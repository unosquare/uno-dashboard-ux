import { DataTypes, SortDirection } from '../constants';

export interface TableColumn {
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
}

const sanitizeNumericString = (str: any) =>
    Number(str.toString().replaceAll(',', '').replaceAll('$', '').replaceAll('%', '').trim());

const compareDates = (date1: any, date2: any) => new Date(date1).getTime() - new Date(date2).getTime();

const numericTypes = ['number', 'decimal', 'percentage', 'money', 'days', 'months', 'boolean'];

const checkNumericString = (a: any, b: any, sortColumn: number) => {
    if (
        (a[sortColumn].toString().includes('$') && b[sortColumn].toString().includes('$')) ||
        (a[sortColumn].toString().includes('%') && b[sortColumn].toString().includes('%'))
    ) {
        const numStrA = sanitizeNumericString(a[sortColumn]);
        const numStrB = sanitizeNumericString(b[sortColumn]);

        if (typeof numStrA === 'number' && typeof numStrB === 'number') {
            const result = numStrA - numStrB;
            if (result !== 0) return result;
        }
    }

    return 0;
};

const sortComparer = (left: any, right: any) =>
    left.toString().trim().localeCompare(right.toString().trim(), undefined, { numeric: true, sensitivity: 'base' });

const sortOneColumn = <T extends TableColumn>(
    left: any,
    right: any,
    index: any,
    definition: T[],
    sortColumns: T[],
    getSortIndex?: (order: any) => any,
) => {
    const { sortOrder, dataType, sortDirection } = sortColumns[index];
    if (dataType === 'file') return 0;

    const sortColumn = getSortIndex ? getSortIndex(sortOrder) : definition.findIndex((x) => x.sortOrder === sortOrder);

    if (left[sortColumn] === null) return 1;
    if (right[sortColumn] === null) return -1;

    const a = sortDirection === 'desc' ? right : left;
    const b = sortDirection === 'desc' ? left : right;

    if (dataType === 'link') return sortComparer(a[sortColumn][1], b[sortColumn][1]);

    if (dataType === 'date') {
        const result = compareDates(a[sortColumn], b[sortColumn]);

        if (result !== 0) return result;
    }

    if (numericTypes.includes(dataType || 'string')) {
        const result = a[sortColumn] - b[sortColumn];

        if (result !== 0) return result;
    }

    const resultNumericString = checkNumericString(a, b, sortColumn);

    if (resultNumericString !== 0) return resultNumericString;

    return sortComparer(a[sortColumn], b[sortColumn]);
};

export const sortData = <T extends TableColumn>(data: any[], definition: T[], getSortIndex?: (order: any) => any) => {
    data.sort((left: any, right: any) => {
        const sortColumns = definition
            .filter((x) => x.sortOrder && x.sortOrder >= 1)
            .sort((x, y) => Number(x.sortOrder) - Number(y.sortOrder));

        // eslint-disable-next-line guard-for-in
        for (const index in sortColumns) {
            const result = sortOneColumn(left, right, index, definition, sortColumns, getSortIndex);
            if (result !== 0) return result;
        }

        return 0;
    });

    return data;
};
