import { TableColumn } from './constants';
import { formatTicks, getAlignment, getValueFormatted, translateFormat } from './utils';

describe('getAlignment', () => {
    it('returns text-left for paragraph data type', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'paragraph' };
        expect(getAlignment(tableColumn)).toBe('text-left');
    });

    it('returns text-left for first column of left-aligned data types', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'string' };
        expect(getAlignment(tableColumn, 0)).toBe('text-left');
    });

    it('returns text-center for right-aligned data types', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'number' };
        expect(getAlignment(tableColumn)).toBe('text-right');
    });

    it('returns text-right for right-aligned data types', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'money' };
        expect(getAlignment(tableColumn)).toBe('text-right');
    });

    it('returns custom text alignment class when provided', () => {
        const tableColumn: TableColumn = { label: 'column', dataType: 'number', textAlign: 'center' };
        expect(getAlignment(tableColumn)).toBe('text-center');
    });
});

describe('formatTicks', () => {
    it('should format ticks as money', () => {
        expect(formatTicks(1000, 'money')).toBe('1K');
        expect(formatTicks(1000000, 'money')).toBe('1M');
        expect(formatTicks(500000, 'money')).toBe('500K');
        expect(formatTicks(999, 'money')).toBe('$999.00');
    });

    it('should format ticks with other format types', () => {
        expect(formatTicks(100, 'percentage')).toBe('100.00%');
        expect(formatTicks(500, 'number')).toBe('500');
    });
});

describe('translateFormat', () => {
    it('should translate format types', () => {
        expect(translateFormat('money')).toBe('money');
        expect(translateFormat('percentage')).toBe('percentage');
        expect(translateFormat('number')).toBe('number');
        expect(translateFormat('negative')).toBe('number');
    });
});

describe('getValueFormatted', () => {
    it('should format values as money', () => {
        expect(getValueFormatted(1000, 'money')).toBe('$1,000.00');
    });

    it('should format values as percentage', () => {
        expect(getValueFormatted(100, 'percentage')).toBe('100.00%');
    });

    it('should format values as number', () => {
        expect(getValueFormatted(1000, 'number')).toBe('1000');
    });

    it('should format values as negative', () => {
        expect(getValueFormatted(1000, 'negative')).toBe('1000');
    });
});
