import React, { useEffect, useState } from 'react';
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
import { Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import ChartTooltip from '@tremor/react/dist/components/chart-elements/common/ChartTooltip';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { ChartComponent } from '../constants';
import { NoData } from '../NoData';
import { formatTicks, getValueFormatted } from '../utils';
import { ChartLineShimmer } from '../ChartShimmers';

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

export const getChartSeries = (data: Record<string, unknown>[]) =>
    data.reduce((current: string[], serie: Record<string, unknown>) => {
        Object.keys(serie)
            .filter((property) => property !== 'name')
            .forEach((entry) => {
                if (!current.includes(entry)) current.push(entry);
            });
        return current;
    }, new Array<string>());

export const DataChart = <T,>({
    dataCallback,
    rawData,
    colors = themeColorRange,
    legend,
    onClick,
    legendFormatType,
    domain,
    unit,
    refLineY,
    className,
}: DataChartSettings<T>) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(Number(t), legendFormatType) : t) as string;
    const categoryColors = constructCategoryColors(getChartSeries(dataStore), colors);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickEvent = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event !== null && event.activeTooltipIndex !== null && onClick)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            onClick(Number(event.activeTooltipIndex), String(event.activeLabel));
    };

    useEffect(() => {
        setDataStore((dataCallback && rawData && dataCallback(rawData)) || []);
    }, [rawData, dataCallback]);

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
                            className={tremorTwMerge(
                                // common
                                'text-tremor-label',
                                // light
                                'fill-tremor-content',
                                // dark
                                'dark:fill-dark-tremor-content',
                            )}
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
                            wrapperStyle={{ outline: 'none' }}
                            isAnimationActive={false}
                            cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                            content={({ active, payload, label }) => (
                                <ChartTooltip
                                    active={active}
                                    payload={payload}
                                    label={label as string}
                                    valueFormatter={(value: number) => getValueFormatted(value, legendFormatType)}
                                    categoryColors={categoryColors}
                                />
                            )}
                            position={{ y: 0 }}
                        />
                        {legend && (
                            <Legend
                                iconType='circle'
                                verticalAlign='top'
                                height={legendHeight}
                                content={({ payload }) =>
                                    ChartLegend({ payload }, categoryColors, setLegendHeight, undefined, undefined)
                                }
                            />
                        )}
                        {getChartSeries(dataStore).map((property: string, index: number) => (
                            <Line
                                className={getColorClassNames(colors[index], colorPalette.text).strokeColor}
                                activeDot={{
                                    className: tremorTwMerge(
                                        'stroke-tremor-background dark:stroke-dark-tremor-background',
                                        getColorClassNames(colors[index], colorPalette.text).fillColor,
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
