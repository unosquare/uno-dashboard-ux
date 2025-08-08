import { useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { twMerge } from 'tailwind-merge';
import { getMap } from '../ChartCommon';
import { ChartLegend } from '../ChartLegend';
import { ChartLineShimmer } from '../ChartShimmers';
import { ChartTooltip } from '../ChartTooltip';
import type { ChartComponent } from '../constants';
import { Flex } from '../Flex';
import { useChart } from '../hooks';
import { NoData } from '../NoData';
import { colorPalette, getColorClassNames } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import { formatTicks, getValueFormatted } from '../utils';

export type DataChartSettings<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    legend?: boolean;
    onClick?: (activeTooltipIndex: number, activeLabel: string) => void;
    domain?: number;
    unit?: string;
    refLineY?: { value: number; label: string; color: string };
};

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

export const DataChart = <T,>({
    dataCallback,
    rawData,
    legend,
    onClick,
    legendFormatType,
    domain,
    unit,
    refLineY,
    className,
}: DataChartSettings<T>) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, categoryColors, keys] = useChart(rawData, dataCallback);

    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(Number(t), legendFormatType) : t) as string;

    const onClickEvent = (event: any) => {
        if (event?.activeTooltipIndex !== null && onClick)
            onClick(Number(event.activeTooltipIndex), String(event.activeLabel));
    };

    if (!rawData) return <ChartLineShimmer className={className} />;

    return (
        <Flex className={twMerge('w-full h-60', className)}>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <LineChart data={dataStore} margin={margin} onClick={onClickEvent}>
                        <CartesianGrid strokeDasharray='2 2' />
                        <XAxis dataKey='name' padding={xPadding} />
                        <YAxis
                            tickFormatter={tickFormatter}
                            type='number'
                            domain={[0, domain ?? 'auto']}
                            unit={unit}
                            allowDecimals={false}
                            tick={{ transform: 'translate(-3, 0)' }}
                            fill=''
                            stroke=''
                            className={unoTwMerge(
                                // common
                                'text-unodashboard-label',
                                // light
                                'fill-unodashboard-content',
                                // dark
                                'dark:fill-dark-unodashboard-content',
                            )}
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
                        {keys.map((property) => (
                            <Line
                                className={
                                    getColorClassNames(categoryColors.get(property) ?? 'blue', colorPalette.background)
                                        .strokeColor
                                }
                                activeDot={{
                                    className: unoTwMerge(
                                        'stroke-unodashboard-background dark:stroke-dark-unodashboard-background',
                                        getColorClassNames(
                                            categoryColors.get(property) ?? 'blue',
                                            colorPalette.background,
                                        ).fillColor,
                                    ),
                                }}
                                type='monotone'
                                name={property}
                                dataKey={property}
                                dot={false}
                                stroke=''
                                strokeWidth={2}
                                strokeLinejoin='round'
                                strokeLinecap='round'
                                key={property}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
