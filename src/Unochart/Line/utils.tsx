import * as d3Shape from 'd3-shape';

export const createLineGenerator = (
    type: string,
    xScale: (value: number) => number,
    yScale: (value: number) => number,
    dataKey: string,
) =>
    d3Shape
        .line()
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .defined((d: any) => d[dataKey] !== null && d[dataKey] !== undefined)
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .x((d: any) => xScale(d.index))
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .y((d: any) => {
            const value = d[dataKey];
            return value !== null && value !== undefined ? yScale(value) : yScale(0);
        })
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .curve((d3Shape as any)[`curve${type.charAt(0).toUpperCase() + type.slice(1)}`] || d3Shape.curveLinear);

export const renderPathSegments = (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    lineGenerator: any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    processedData: Array<{ [key: string]: any }>,
    stroke: string,
    strokeDasharray: string,
    connectNulls: boolean,
) => {
    if (connectNulls) {
        const filteredData = processedData.filter(lineGenerator.defined());
        return (
            <path
                d={lineGenerator(filteredData) || ''}
                fill='none'
                stroke={stroke}
                strokeWidth={2}
                strokeDasharray={strokeDasharray}
                style={{ transition: 'all 0.3s' }}
            />
        );
    } else {
        const segments: Array<{ [key: string]: any }> = [];
        let segment: Array<{ [key: string]: any }> = [];

        processedData.forEach((d) => {
            if (lineGenerator.defined()(d)) {
                segment.push(d);
            } else if (segment.length) {
                segments.push(segment);
                segment = [];
            }
        });

        if (segment.length) {
            segments.push(segment);
        }

        return segments.map((segment, i) => (
            <path
                key={`segment-${segment[0].index}`}
                d={lineGenerator(segment) || ''}
                fill='none'
                stroke={stroke}
                strokeWidth={2}
                strokeDasharray={strokeDasharray}
                style={{ transition: 'all 0.3s' }}
            />
        ));
    }
};
