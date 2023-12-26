import { compareDates, defaultStringFilter, sortNumericString } from 'uno-js';
import { DataTypes, TableCellTypes, TableColumn } from '../constants';

export const searchData = (search: string | undefined, newData: TableCellTypes[][], definitions: TableColumn[]) => {
    if (!search) return newData;

    const ignoreColumns = definitions
        .filter((y) => y.disableSearch === true)
        .map((x) => definitions.findIndex((z) => z.label === x.label));

    return newData.filter((section: TableCellTypes[]) =>
        section.filter((_: unknown, i: number) => !ignoreColumns.includes(i)).some(defaultStringFilter(search)),
    );
};

const numericTypes: DataTypes[] = ['number', 'decimal', 'percentage', 'money', 'days', 'months', 'boolean'];

const sortOneColumn = <T extends TableColumn>(
    left: TableCellTypes[],
    right: TableCellTypes[],
    { sortOrder, dataType, sortDirection }: T,
    getSortIndex: (order: number) => number,
) => {
    const sortColumn = getSortIndex(sortOrder ?? 0);

    if (left[sortColumn] === null) return 1;
    if (right[sortColumn] === null) return -1;

    const a = sortDirection === 'desc' ? right : left;
    const b = sortDirection === 'desc' ? left : right;

    if (dataType === 'date') {
        const result = compareDates(String(a[sortColumn]), String(b[sortColumn]));

        if (result !== 0) return result;
    }

    if (numericTypes.includes(dataType ?? 'string')) {
        const result = Number(a[sortColumn]) - Number(b[sortColumn]);

        if (result !== 0) return result;
    }

    return sortNumericString(String(a[sortColumn]), String(b[sortColumn]));
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
