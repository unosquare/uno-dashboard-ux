import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { twMerge } from 'tailwind-merge';
import { ChartDecorators } from '../ChartCommon';
import { ChartLineShimmer } from '../ChartShimmers';
import { Flex } from '../Flex';
import { NoData } from '../NoData';
import type { ChartComponent } from '../constants';
import { useChart } from '../hooks';
import { colorPalette, getColorClassNames } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import { formatTicks } from '../utils';

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

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(Number(t), legendFormatType) : t) as string;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
                        {ChartDecorators({
                            keys,
                            refLineY,
                            legendFormatType,
                            categoryColors,
                            legend,
                            legendHeight,
                            setLegendHeight,
                        })}
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
