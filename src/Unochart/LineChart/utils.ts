const findMinValue = (data: Array<{ [key: string]: any }>): number =>
    Math.floor(
        Math.min(
            ...data.map((d) =>
                Math.min(...Object.values(d).map((v) => (typeof v === 'number' ? v : Number.POSITIVE_INFINITY))),
            ),
        ),
    );

export const roundMaxValue = (data: Array<{ [key: string]: any }>): { maxValue: number; minValue: number } => {
    const minValue = findMinValue(data);
    const maxValue = Math.max(
        ...data.map((d) =>
            Math.max(...Object.values(d).map((v) => (typeof v === 'number' ? v : Number.NEGATIVE_INFINITY))),
        ),
    );

    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const factor = maxValue / magnitude;

    let finalMaxValue;
    if (factor <= 1.5) {
        finalMaxValue = 1.5 * magnitude;
    } else if (factor <= 3) {
        finalMaxValue = 3 * magnitude;
    } else if (factor <= 7) {
        finalMaxValue = 7 * magnitude;
    } else {
        finalMaxValue = 10 * magnitude;
    }

    const finalMinValue = minValue < 0 ? -finalMaxValue : 0;

    return {
        maxValue: Math.ceil(finalMaxValue),
        minValue: finalMinValue,
    };
};
