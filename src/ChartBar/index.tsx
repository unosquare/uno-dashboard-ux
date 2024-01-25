import React, { ReactElement, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { colorPalette } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { ChartComponent, LegendFormatType } from '../constants';
import { NoData } from '../NoData';
import { formatTicks } from '../utils';
import { ChartBarShimmer } from '../ChartShimmers';
import { ChartDecorators } from '../ChartCommon';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { useChart } from '../hooks';

type XAxisPrimaryFormatter = {
    (input: string): string;
};

export type ChartBarSettings<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    legendFormatType?: LegendFormatType;
    legend?: boolean;
    domain?: number;
    unit?: string;
    barSize?: number;
    xAxis?: boolean;
    multiXAxis?: {
        primary: XAxisPrimaryFormatter;
        secondary: (props: React.ComponentPropsWithRef<'svg'>) => ReactElement<SVGElement>;
    };
    stacked?: boolean;
    onClick?: (activeLabel: string, activeTooltipIndex: number) => void;
    refLineY?: { value: number; label: string; color: string };
};

export const ChartBar = <T,>({
    rawData,
    dataCallback,
    legend,
    domain,
    unit = '',
    barSize = 50,
    xAxis = true,
    multiXAxis,
    stacked,
    onClick,
    legendFormatType,
    refLineY,
    className,
}: ChartBarSettings<T>) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, categoryColors, keys] = useChart(rawData, dataCallback);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(Number(t), legendFormatType) : t) as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickEvent = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event?.activeLabel && onClick) onClick(String(event.activeLabel), Number(event.activeTooltipIndex));
    };

    if (!rawData) return <ChartBarShimmer className={className} />;

    return (
        <Flex className={twMerge('w-full h-60', className)}>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <BarChart data={dataStore} maxBarSize={barSize} onClick={onClickEvent}>
                        {xAxis && <XAxis dataKey='name' tickFormatter={multiXAxis?.primary} />}
                        {xAxis && multiXAxis && (
                            <XAxis
                                dataKey='name'
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                height={1}
                                scale='auto'
                                xAxisId='secondary'
                                tick={multiXAxis.secondary}
                            />
                        )}
                        <YAxis
                            tickFormatter={tickFormatter}
                            type='number'
                            domain={[0, domain ?? 'auto']}
                            unit={unit}
                            allowDecimals={false}
                            width={70}
                            className={tremorTwMerge(
                                // common
                                'text-tremor-label',
                                // light
                                'fill-tremor-content',
                                // dark
                                'dark:fill-dark-tremor-content',
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
                        {keys.map((property) =>
                            stacked ? (
                                <Bar
                                    dataKey={property}
                                    className={
                                        getColorClassNames(
                                            categoryColors.get(property) ?? BaseColors.Gray,
                                            colorPalette.background,
                                        ).fillColor
                                    }
                                    fill=''
                                    key={property}
                                    stackId='a'
                                />
                            ) : (
                                <Bar
                                    dataKey={property}
                                    fill=''
                                    className={
                                        getColorClassNames(
                                            categoryColors.get(property) ?? BaseColors.Gray,
                                            colorPalette.background,
                                        ).fillColor
                                    }
                                    key={property}
                                >
                                    {dataStore.map(() => (
                                        <Cell key={uuidv4()} />
                                    ))}
                                </Bar>
                            ),
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
