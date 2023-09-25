import React, { useState } from 'react';
import {
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { FormatTypes } from 'uno-js';
import { Flex } from '@tremor/react';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';
import { UnoChartTooltip } from '../ChartLegend';
import { NoData } from '../NoData';
import { ChartComponent, LegendFormatType } from '../constants';
import { formatTicks } from '../utils';
import { ChartLineShimmer } from '../ChartShimmers';

export type legendXAxis = { left: LegendFormatType; right: LegendFormatType };
export type lineChart = { dataKey: string; yAxisId: string };

interface ComposedLineChartSettings<TDataIn> extends ChartComponent<TDataIn, Record<string, unknown>[]> {
    legend?: boolean;
    onClick?: (e: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
    domain?: number;
    unit?: string;
    refLineY?: { value: number; label: string; color: string };
    isLoading?: boolean;
    formats?: FormatTypes[];
    legendFormatTypes?: legendXAxis;
    lines: lineChart[];
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
    isLoading,
    formats,
    lines,
}: ComposedLineChartSettings<T>) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const dataStore: Record<string, unknown>[] = (dataCallback && rawData && dataCallback(rawData)) || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tickFormatter = (t: any, orientation: 'left' | 'right') =>
        legendFormatTypes ? formatTicks(Number(t), legendFormatTypes[orientation]) : String(t);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leftTickFormatter = (t: any) => tickFormatter(t, 'left');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rightTickFormatter = (t: any) => tickFormatter(t, 'right');

    const categoryColors = constructCategoryColors(
        lines.map((x) => x.dataKey),
        themeColorRange,
    );

    if (isLoading) return <ChartLineShimmer />;

    return (
        <Flex className='w-full h-48'>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <ComposedChart data={dataStore} margin={margin} onClick={onClick}>
                        {lines.map((property: lineChart) => (
                            <Line
                                className={
                                    getColorClassNames(
                                        categoryColors.get(property.dataKey) ?? BaseColors.Gray,
                                        colorPalette.text,
                                    ).strokeColor
                                }
                                activeDot={{
                                    className: tremorTwMerge(
                                        'stroke-tremor-background dark:stroke-dark-tremor-background',
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
                        {refLineY && (
                            <ReferenceLine
                                y={refLineY.value}
                                label={{
                                    position: 'insideTopRight',
                                    value: refLineY.label,
                                    fontSize: 11,
                                    offset: 7,
                                }}
                                stroke={refLineY.color}
                            />
                        )}
                        <Tooltip
                            offset={30}
                            content={<UnoChartTooltip formats={formats} categoryColors={categoryColors} />}
                            isAnimationActive={false}
                        />
                        {legend && (
                            <Legend
                                iconType='circle'
                                height={legendHeight}
                                content={({ payload }) =>
                                    ChartLegend({ payload }, categoryColors, setLegendHeight, undefined, undefined)
                                }
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
