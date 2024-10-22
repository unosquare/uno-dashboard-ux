import { useMemo, useState } from 'react';
import { compareDates, defaultStringFilter, sortNumericString, trimText } from 'uno-js';
import { DataTypes, TableCellTypes, TableColumn } from '../constants';
import { isFinancialMetric, isTenureObject, moneyToNumber } from '../utils';

// Create a search index for faster lookups
const createSearchIndex = (
    data: TableCellTypes[][],
    definitions: TableColumn[],
): { wordIndex: Map<string, Set<number>>; fullTextIndex: Map<number, string[]> } => {
    const wordIndex = new Map<string, Set<number>>();
    const fullTextIndex = new Map<number, string[]>();

    const searchableColumns = definitions
        .map((def, index) => ({ index, disabled: def.disableSearch }))
        .filter((col) => !col.disabled)
        .map((col) => col.index);

    data.forEach((row, rowIndex) => {
        searchableColumns.forEach((colIndex) => {
            const value = row[colIndex];
            if (value === null) return;

            const fullText = String(value).toLowerCase();

            // Store the full text for exact phrase matching
            if (!fullTextIndex.has(rowIndex)) {
                fullTextIndex.set(rowIndex, []);
            }
            fullTextIndex.get(rowIndex)?.push(fullText);

            // Add individual words to word index
            const words = fullText.split(/\s+/).filter((word) => word.length > 0);

            words.forEach((word) => {
                if (!wordIndex.has(word)) {
                    wordIndex.set(word, new Set());
                }
                wordIndex.get(word)?.add(rowIndex);
            });
        });
    });

    return { wordIndex, fullTextIndex };
};

const findMatchingRows = (
    searchTerm: string,
    wordIndex: Map<string, Set<number>>,
    fullTextIndex: Map<number, string[]>,
): Set<number> => {
    const matches = new Set<number>();
    const termLower = searchTerm.toLowerCase();

    // Check if it's a multi-word search
    const words = termLower.split(/\s+/).filter((w) => w.length > 0);

    if (words.length > 1) {
        // For multi-word searches, check the full text first
        fullTextIndex.forEach((texts, rowIndex) => {
            if (texts.some((text) => text.includes(termLower))) {
                matches.add(rowIndex);
            }
        });

        // If no exact matches found, try matching all individual words
        if (matches.size === 0) {
            const wordMatches = words.map((word) => {
                const matching = new Set<number>();
                wordIndex.forEach((rowIndices, indexedWord) => {
                    if (indexedWord.includes(word)) {
                        rowIndices.forEach((index) => {
                            matching.add(index);
                        });
                    }
                });
                return matching;
            });

            // Find rows that match all words
            if (wordMatches.length > 0) {
                wordMatches[0].forEach((rowIndex) => {
                    if (wordMatches.every((set) => set.has(rowIndex))) {
                        matches.add(rowIndex);
                    }
                });
            }
        }
    } else {
        // For single-word searches, use the word index
        wordIndex.forEach((rowIndices, indexedWord) => {
            if (indexedWord.includes(termLower)) {
                rowIndices.forEach((index) => {
                    matches.add(index);
                });
            }
        });
    }

    return matches;
};

// Hook for optimized table search
export const useTableSearch = (data: TableCellTypes[][], definitions: TableColumn[]) => {
    const [search, setSearch] = useState('');

    // Create search indices only when data or definitions change
    const { wordIndex, fullTextIndex } = useMemo(() => createSearchIndex(data, definitions), [data, definitions]);

    // Optimized search function
    const filteredData = useMemo(() => {
        if (!search) return data;

        const searchTerms = search
            .toLowerCase()
            .split(' or ')
            .map(trimText)
            .filter((term) => term.length > 0);

        // Get matching row indices for each search term
        const matchingSets = searchTerms.map((term) => findMatchingRows(term, wordIndex, fullTextIndex));

        // Combine results using OR logic
        const matchingRows = new Set<number>();
        matchingSets.forEach((set) => {
            set.forEach((rowIndex) => {
                matchingRows.add(rowIndex);
            });
        });

        // Return only matching rows
        return Array.from(matchingRows).map((index) => data[index]);
    }, [data, search, wordIndex, fullTextIndex]);

    return {
        filteredData,
        search,
        setSearch,
    };
};

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
    value instanceof Array && value.length > 1 ? value[1] : String(value);

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
