import { useMemo, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartDecorators } from '../ChartCommon';
import { ChartLineShimmer } from '../ChartShimmers';
import { Flex } from '../Flex';
import { NoData } from '../NoData';
import type { ChartComponent, LegendFormatType } from '../constants';
import { BaseColors, colorPalette, constructCategoryColors, getColorClassNames, themeColorRange } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import { formatTicks } from '../utils';

export type legendXAxis = { left: LegendFormatType; right: LegendFormatType };
export type lineChart = { dataKey: string; yAxisId: string };

interface ComposedLineChartSettings<TDataIn> extends ChartComponent<TDataIn, Record<string, unknown>[]> {
    legend?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onClick?: (e: any) => void;
    domain?: number;
    unit?: string;
    refLineY?: { value: number; label: string; color: string };
    legendFormatTypes?: legendXAxis;
    lines: lineChart[];
    bars?: lineChart[];
}

const margin = {
    top: 5,
    right: 5,
    left: 5,
    bottom: 5,
};

const xPadding = {
    left: 20,
    right: 20,
};

export const ComposedLineChart = <T,>({
    dataCallback,
    rawData,
    legend,
    onClick,
    legendFormatTypes,
    domain,
    unit,
    refLineY,
    lines,
    bars,
}: ComposedLineChartSettings<T>) => {
    const dataTransformFn = useMemo(
        () => dataCallback ?? ((data: T) => data as unknown as Record<string, unknown>[]),
        [dataCallback],
    );
    const [legendHeight, setLegendHeight] = useState(60);
    const dataStore: Record<string, unknown>[] = (rawData && dataTransformFn(rawData)) || [];

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const tickFormatter = (t: any, orientation: 'left' | 'right') =>
        legendFormatTypes ? formatTicks(Number(t), legendFormatTypes[orientation]) : String(t);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const leftTickFormatter = (t: any) => tickFormatter(t, 'left');
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const rightTickFormatter = (t: any) => tickFormatter(t, 'right');

    const categoryColors = constructCategoryColors(
        [...lines, ...(bars ?? [])].map((x) => x.dataKey),
        themeColorRange,
    );

    if (!rawData) return <ChartLineShimmer />;

    const keys = dataStore.length > 0 ? Object.keys(dataStore[0]).filter((property) => property !== 'name') : [];

    return (
        <Flex className='w-full h-48'>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <ComposedChart data={dataStore} margin={margin} onClick={onClick}>
                        {bars?.map((property: lineChart) => (
                            <Bar
                                dataKey={property.dataKey}
                                fill=''
                                className={
                                    getColorClassNames(
                                        categoryColors.get(property.dataKey) ?? BaseColors.Gray,
                                        colorPalette.background,
                                    ).fillColor
                                }
                                key={property.dataKey}
                                yAxisId={property.yAxisId}
                            />
                        ))}
                        {lines.map((property: lineChart) => (
                            <Line
                                className={
                                    getColorClassNames(
                                        categoryColors.get(property.dataKey) ?? BaseColors.Gray,
                                        colorPalette.text,
                                    ).strokeColor
                                }
                                activeDot={{
                                    className: unoTwMerge(
                                        'stroke-unodashboard-background dark:stroke-dark-unodashboard-background',
                                        getColorClassNames(
                                            categoryColors.get(property.dataKey) ?? BaseColors.Gray,
                                            colorPalette.text,
                                        ).fillColor,
                                    ),
                                }}
                                type='monotone'
                                dot={false}
                                dataKey={property.dataKey}
                                stroke=''
                                strokeWidth={2}
                                strokeLinejoin='round'
                                strokeLinecap='round'
                                key={property.dataKey}
                                yAxisId={property.yAxisId}
                            />
                        ))}
                        <CartesianGrid strokeDasharray='2 2' />
                        <XAxis dataKey='name' padding={xPadding} />
                        <YAxis
                            yAxisId='left'
                            tickFormatter={leftTickFormatter}
                            type='number'
                            domain={[0, domain ?? 'auto']}
                            unit={unit}
                            allowDecimals={false}
                        />
                        <YAxis
                            yAxisId='right'
                            tickFormatter={rightTickFormatter}
                            type='number'
                            domain={[0, 'auto']}
                            unit={unit}
                            allowDecimals
                            orientation='right'
                        />
                        {ChartDecorators({
                            keys,
                            refLineY,
                            legendFormatType: 'number',
                            categoryColors,
                            legend,
                            legendHeight,
                            setLegendHeight,
                        })}
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
