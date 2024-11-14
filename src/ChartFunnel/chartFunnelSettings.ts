import type { FormatTypes } from 'uno-js';

export interface ChartFunnelEntry {
    name: string;
    value: number;
}

export interface ChartFunnelSettings<T> {
    rawData?: T;
    dataCallback?: (data: T) => ChartFunnelEntry[];
    width?: string;
    formatType: FormatTypes;
    calculateSizes: { orderedValues: number[]; sizes: string[] };
}
