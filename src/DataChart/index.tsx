import objectHash from 'object-hash';
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
import { UnoChartTooltip } from '../ChartLegend';
import { ChartComponent, ChartTooltipType } from '../constants';
import { NoData } from '../NoData';
import { formatTicks, getValueFormatted } from '../utils';
import { ChartLineShimmer } from '../ChartShimmers';

export type DataChartSettings<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    legend?: boolean;
    tooltip?: ChartTooltipType;
    onClick?: (e: any) => void;
    domain?: number;
    unit?: string;
    refLineY?: { value: number; label: string; color: string };
    isLoading?: boolean;
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
    data.reduce((current: string[], serie: any) => {
        Object.keys(serie)
            .filter((property) => property !== 'name')
            .forEach((entry) => {
                if (!current.includes(entry)) current.push(entry);
            });
        return current;
    }, []);

export const DataChart = ({
    dataCallback,
    rawData,
    colors = themeColorRange,
    legend,
    onClick,
    legendFormatType,
    domain,
    unit,
    refLineY,
    isLoading,
    className,
    tooltip = 'classic',
}: DataChartSettings<any>) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>([]);

    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(t, legendFormatType) : t);
    const categoryColors = constructCategoryColors(getChartSeries(dataStore), colors);

    useEffect(() => {
        setDataStore((dataCallback && rawData && dataCallback(rawData)) || []);
    }, [rawData, dataCallback]);

    if (isLoading) return <ChartLineShimmer className={className} />;

    return (
        <Flex className={twMerge('w-full h-60', className)}>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <LineChart data={dataStore} margin={margin} onClick={onClick}>
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
                            content={
                                tooltip === 'classic' ? (
                                    <UnoChartTooltip
                                        legendFormatType={legendFormatType}
                                        categoryColors={categoryColors}
                                    />
                                ) : (
                                    ({ active, payload, label }) => (
                                        <ChartTooltip
                                            active={active}
                                            payload={payload}
                                            label={label}
                                            valueFormatter={(value: number) =>
                                                getValueFormatted(value, legendFormatType)
                                            }
                                            categoryColors={categoryColors}
                                        />
                                    )
                                )
                            }
                            position={{ y: 0 }}
                        />
                        {legend && (
                            <Legend
                                iconType='circle'
                                verticalAlign='top'
                                height={legendHeight}
                                content={({ payload }) => ChartLegend({ payload }, categoryColors, setLegendHeight)}
                            />
                        )}
                        {getChartSeries(dataStore).map((property: any, index: number) => (
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
                                key={objectHash(property)}
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
