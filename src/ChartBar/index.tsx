import type React from 'react';
import { type ReactElement, useState } from 'react';
import { Bar, BarChart, Cell, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { getMap } from '../ChartCommon';
import { ChartLegend } from '../ChartLegend';
import { ChartBarShimmer } from '../ChartShimmers';
import { ChartTooltip } from '../ChartTooltip';
import type { ChartComponent, LegendFormatType } from '../constants';
import { Flex } from '../Flex';
import { useChart } from '../hooks';
import { NoData } from '../NoData';
import { BaseColors, colorPalette, getColorClassNames } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import { formatTicks, getValueFormatted } from '../utils';

type XAxisPrimaryFormatter = (input: string) => string;

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

    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(Number(t), legendFormatType) : t) as string;

    const onClickEvent = (event: any) => {
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
