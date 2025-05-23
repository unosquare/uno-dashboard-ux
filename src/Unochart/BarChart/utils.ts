import type { ChartDataV2 } from "../../constants";

export const findMinValue = (data: ChartDataV2): number => {
    let minValue: number;

    minValue = Math.min(
        ...data.map((d) =>
            Math.min(
                ...Object.values(d).map((v) => {
                    if (typeof v === 'number') {
                        return v;
                    } else if (Array.isArray(v)) {
                        return Math.min(...v); // Usar el valor mínimo del rango
                    }
                    return Number.POSITIVE_INFINITY; // Valor por defecto si no es ni número ni array
                }),
            ),
        ),
    );

    return Math.floor(minValue);
};

export const roundMaxValue = (data: ChartDataV2, stacked = false): { maxValue: number; minValue: number } => {
    let maxValue: number;
    let minValue: number = findMinValue(data);

    if (stacked) {
        const stackedSums = data.map((d) =>
            Object.values(d).reduce((sum, value) => {
                if (typeof value === 'number') {
                    return sum + value;
                } else if (Array.isArray(value)) {
                    return sum + Math.max(...value); // Sumar el valor máximo del rango
                }
                return sum;
            }, 0),
        );
        maxValue = Math.max(...stackedSums);
    } else {
        maxValue = Math.max(
            ...data.map((d) =>
                Math.max(
                    ...Object.values(d).map((v) => {
                        if (typeof v === 'number') {
                            return v;
                        } else if (Array.isArray(v)) {
                            return Math.max(...v); // Usar el valor máximo del rango
                        }
                        return Number.NEGATIVE_INFINITY; // Valor por defecto si no es ni número ni array
                    }),
                ),
            ),
        );
    }

    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const factor = maxValue / magnitude;

    if (factor <= 1.5) {
        maxValue = 1.5 * magnitude;
    } else if (factor <= 3) {
        maxValue = 3 * magnitude;
    } else if (factor <= 7) {
        maxValue = 7 * magnitude;
    } else {
        maxValue = 10 * magnitude;
    }

    maxValue = Math.ceil(maxValue);

    // Asegurar que el valor mínimo y máximo sean simétricos
    if (minValue < 0) {
        minValue = -maxValue;
    }

    return {
        maxValue: maxValue,
        minValue: minValue,
    };
};

export const parseGap = (gap: string | number, totalSize: number): number => {
    if (typeof gap === 'string' && gap.includes('%')) {
        return (Number.parseFloat(gap) / 100) * totalSize;
    }
    return Number(gap);
};