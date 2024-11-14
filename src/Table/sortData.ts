import { compareDates, defaultStringFilter, sortNumericString, trimText } from 'uno-js';
import type { DataTypes, TableCellTypes, TableColumn } from '../constants';
import { isFinancialMetric, isTenureObject, moneyToNumber } from '../utils';

export const searchData = (search: string | undefined, newData: TableCellTypes[][], definitions: TableColumn[]) => {
    if (!search) return newData;

    const ignoreColumns = definitions
        .filter((y) => y.disableSearch === true)
        .map((x) => definitions.findIndex((z) => z.label === x.label));

    const multiSearch = search
        .toLocaleLowerCase()
        .split(' or ')
        .map(trimText)
        .filter((x) => x.length > 0);

    return newData.filter((section: TableCellTypes[]) =>
        section
            .filter((_: unknown, i: number) => !ignoreColumns.includes(i))
            .some((x) => x !== null && multiSearch.some((y) => defaultStringFilter(y)(x))),
    );
};

const numericTypes: DataTypes[] = ['number', 'decimal', 'percentage', 'money', 'days', 'months', 'boolean'];

const getArrayValueOrDefault = (value: TableCellTypes) =>
    Array.isArray(value) && value.length > 1 ? value[1] : String(value);

const getMonthsOrDefault = (value: TableCellTypes) => (isTenureObject(value) ? value.Months : 0);
const getGrossMaginOrDefault = (value: TableCellTypes) => (isFinancialMetric(value) ? value.GrossMargin : 0);

const sortComplexTypes = (a: TableCellTypes, b: TableCellTypes, dataType: DataTypes | undefined) => {
    switch (dataType) {
        case 'tenure':
            return getMonthsOrDefault(a) - getMonthsOrDefault(b);
        case 'financial':
            return getGrossMaginOrDefault(a) - getGrossMaginOrDefault(b);
        case 'list':
            return (a as string[]).length - (b as string[]).length;
        case 'link':
            return sortNumericString(getArrayValueOrDefault(a), getArrayValueOrDefault(b));
        case 'date':
            return compareDates(String(a), String(b));
        case 'money':
            return moneyToNumber(a) - moneyToNumber(b);
        default:
            return 0;
    }
};

const sortColumnValue = (a: TableCellTypes, b: TableCellTypes, dataType: DataTypes | undefined) => {
    const complexResult = sortComplexTypes(a, b, dataType);
    if (complexResult !== 0) return complexResult;

    if (numericTypes.includes(dataType ?? 'string')) {
        const result = Number(a) - Number(b);
        if (result !== 0) return result;
    }

    return sortNumericString(String(a), String(b));
};

const sortOneColumn = <T extends TableColumn>(
    left: TableCellTypes[],
    right: TableCellTypes[],
    { sortOrder, dataType, sortDirection }: T,
    getSortIndex: (order: number) => number,
) => {
    const sortColumn = getSortIndex(sortOrder ?? 0);

    if (left[sortColumn] === null) return 1;
    if (right[sortColumn] === null) return -1;

    const [a, b] = sortDirection === 'desc' ? [right, left] : [left, right];

    return sortColumnValue(a[sortColumn], b[sortColumn], dataType);
};

export const searchFooter = <TDataIn extends Array<Record<string, unknown>> | Record<string, unknown>>(
    search: string,
    newRaw: TDataIn,
) =>
    Array.isArray(newRaw)
        ? (newRaw.filter((section: Record<string, unknown>) =>
              Object.values(section).some(defaultStringFilter(search)),
          ) as TDataIn)
        : newRaw;

export const sortData = <T extends TableColumn>(
    data: TableCellTypes[][],
    definition: T[],
    getSortIndex?: (order: number) => number,
) => {
    data.sort((left: TableCellTypes[], right: TableCellTypes[]) => {
        const sortColumns = definition
            .filter((x) => x.sortOrder && x.sortOrder >= 1)
            .sort((x, y) => Number(x.sortOrder) - Number(y.sortOrder));

        const sorter = getSortIndex ?? ((sortOrder: number) => definition.findIndex((x) => x.sortOrder === sortOrder));

        for (const i of sortColumns) {
            const result = sortOneColumn(left, right, i, sorter);
            if (result !== 0) return result;
        }

        return 0;
    });

    return data;
};
