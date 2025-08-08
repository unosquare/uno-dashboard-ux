import { useMemo, useState } from 'react';
import {
    Bar,
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
import { getMap } from '../ChartCommon';
import { ChartLegend } from '../ChartLegend';
import { ChartLineShimmer } from '../ChartShimmers';
import { ChartTooltip } from '../ChartTooltip';
import type { ChartComponent, LegendFormatType } from '../constants';
import { Flex } from '../Flex';
import { NoData } from '../NoData';
import { BaseColors, colorPalette, constructCategoryColors, getColorClassNames, themeColorRange } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import { formatTicks, getValueFormatted } from '../utils';

export type legendXAxis = { left: LegendFormatType; right: LegendFormatType };
export type lineChart = { dataKey: string; yAxisId: string };

interface ComposedLineChartSettings<TDataIn> extends ChartComponent<TDataIn, Record<string, unknown>[]> {
    legend?: boolean;
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

const legendFormatType = 'number';

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

    const tickFormatter = (t: any, orientation: 'left' | 'right') =>
        legendFormatTypes ? formatTicks(Number(t), legendFormatTypes[orientation]) : String(t);
    const leftTickFormatter = (t: any) => tickFormatter(t, 'left');
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
                        {refLineY ? (
                            <ReferenceLine
                                key='refLineY'
                                y={refLineY.value}
                                label={{
                                    position: 'insideTopRight',
                                    value: refLineY.label,
                                    fontSize: 11,
                                    offset: 7,
                                }}
                                stroke={refLineY.color}
                            />
                        ) : null}
                        <Tooltip
                            key='tooltip'
                            wrapperStyle={{ outline: 'none' }}
                            isAnimationActive={false}
                            cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                            content={({ active, payload, label }) => (
                                <ChartTooltip
                                    active={active}
                                    payload={payload as any}
                                    label={label as string}
                                    valueFormatter={(value: number) => getValueFormatted(value, legendFormatType)}
                                    categoryColors={categoryColors}
                                />
                            )}
                        />
                        {legend ? (
                            <Legend
                                key='legend'
                                iconType='circle'
                                height={legendHeight}
                                content={({ payload }) =>
                                    ChartLegend(
                                        { payload },
                                        categoryColors.size === 0 ? getMap(keys) : categoryColors,
                                        setLegendHeight,
                                        undefined,
                                        undefined,
                                    )
                                }
                            />
                        ) : null}
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
