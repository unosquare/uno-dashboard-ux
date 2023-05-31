import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DataTypes, SortDirection } from '../constants';

dayjs.extend(utc);

export interface TableColumn {
    label: string;
    dataType?: DataTypes;
    sortOrder?: number;
    sortDirection?: SortDirection;
    disableSearch?: boolean;
    excludeFromSort?: boolean;
}

const sanitizeNumericString = (str: any) =>
    Number(str.toString().replaceAll(',', '').replaceAll('$', '').replaceAll('%', '').trim());

const compareDates = (date1: any, date2: any) => {
    if (dayjs.utc(date1).isAfter(dayjs.utc(date2), 'day')) return 1;
    if (dayjs.utc(date2).isAfter(dayjs.utc(date1), 'day')) return -1;

    return 0;
};

const dateType = [DataTypes.DATE, DataTypes.DATE_LOCAL];

const numericTypes = [
    DataTypes.NUMBER,
    DataTypes.DECIMAL,
    DataTypes.PERCENTAGE,
    DataTypes.DECIMAL_PERCENTAGE,
    DataTypes.MONEY,
    DataTypes.DAYS,
    DataTypes.MONTHS,
    DataTypes.BOOLEAN,
];

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

    const baseSortColumn = definition.findIndex((x) => x.sortOrder === sortOrder);
    const sortColumn = getSortIndex ? getSortIndex(sortOrder) : baseSortColumn;
    if (dataType === DataTypes.FILE) return 0;

    if (left[sortColumn] === null) return 1;
    if (right[sortColumn] === null) return -1;

    const a = sortDirection === SortDirection.DESC ? right : left;
    const b = sortDirection === SortDirection.DESC ? left : right;

    if (dataType && dataType === DataTypes.LINK_STRING) {
        return sortComparer(a[sortColumn][1], b[sortColumn][1]);
    }

    if (dateType.includes(dataType || DataTypes.STRING)) {
        const result = compareDates(a[sortColumn], b[sortColumn]);

        if (result !== 0) return result;
    }

    if (numericTypes.includes(dataType || DataTypes.STRING)) {
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
