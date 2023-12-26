import { TableColumn } from '../constants';
import { searchData, searchFooter, sortData } from './sortData';

describe('searchData', () => {
    const definitions = [
        { label: 'Name'},
        { label: 'Age', disableSearch: true },
        { label: 'Email' },
    ];

    const data = [
        ['John', 30, 'john@example.com'],
        ['Jane', 25, 'jane@example.com'],
        ['Bob', 40, 'bob@example.com'],
    ];

    it('should return all data when search is undefined', () => {
        const result = searchData(undefined, data, definitions);
        expect(result).toEqual(data);
    });

    it('should filter data based on search term', () => {
        const result = searchData('jane', data, definitions);
        expect(result).toEqual([['Jane', 25, 'jane@example.com']]);
    });

    it('should ignore columns with disableSearch=true', () => {
        const result = searchData('30', data, definitions);
        expect(result).toEqual([]);
    });

    it('should ignore case when searching', () => {
        const result = searchData('BOB', data, definitions);
        expect(result).toEqual([['Bob', 40, 'bob@example.com']]);
    });

    it('should return an empty array when no matches are found', () => {
        const result = searchData('foo', data, definitions);
        expect(result).toEqual([]);
    });
});

describe('searchFooter', () => {
    it('should return an empty array when no matches are found', () => {
        const result = searchFooter('foo', [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
        expect(result).toEqual([]);
    });

    it('should return all items when search matches all properties', () => {
        const result = searchFooter('30', [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 30 },
        ]);
        expect(result).toEqual([
            { name: 'John', age: 30 },
            { name: 'Jane', age: 30 },
        ]);
    });

    it('should return only matching items', () => {
        const result = searchFooter('jane', [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
        expect(result).toEqual([{ name: 'Jane', age: 25 }]);
    });

    it('should ignore case when searching', () => {
        const result = searchFooter('jOhN', [
            { name: 'John', age: 30 },
            { name: 'Jane', age: 25 },
        ]);
        expect(result).toEqual([{ name: 'John', age: 30 }]);
    });
});

describe('sortData', () => {
    const definitions = [
        { label: 'Name', dataType: 'string', sortOrder: 1, sortDirection: 'asc' },
        { label: 'Age', dataType: 'number', sortOrder: 2, sortDirection: 'desc' },
        { label: 'Email', dataType: 'string', sortOrder: 3, sortDirection: 'asc' },
    ] as TableColumn[];

    const data = [
        ['John', 30, 'john@example.com'],
        ['Jane', 25, 'jane@example.com'],
        ['Bob', 40, 'bob@example.com'],
    ];

    it('should sort data based on one column', () => {
        const result = sortData(data, definitions);
        expect(result).toEqual([
            ['Bob', 40, 'bob@example.com'],
            ['Jane', 25, 'jane@example.com'],
            ['John', 30, 'john@example.com'],
        ]);
    });

    it('should sort data based on multiple columns', () => {
        const newDefinitions = [
            { label: 'Name', dataType: 'string', sortOrder: 1, sortDirection: 'asc' },
            { label: 'Age', dataType: 'number', sortOrder: 2, sortDirection: 'asc' },
            { label: 'Email', dataType: 'string', sortOrder: 3, sortDirection: 'asc' },
        ] as TableColumn[];

        const newData = [
            ['John', 30, 'john@example.com'],
            ['Jane', 25, 'jane@example.com'],
            ['Bob', 40, 'bob@example.com'],
            ['John', 25, 'john@example.com'],
        ];

        const result = sortData(newData, newDefinitions);
        expect(result).toEqual([
            ['Bob', 40, 'bob@example.com'],
            ['Jane', 25, 'jane@example.com'],
            ['John', 25, 'john@example.com'],
            ['John', 30, 'john@example.com'],
        ]);
    });
});
