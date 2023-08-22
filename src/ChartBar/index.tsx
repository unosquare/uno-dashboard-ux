import React, { ReactElement, useState } from 'react';
import {
    Bar,
    BarChart,
    Brush,
    Cell,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { humanize } from 'uno-js';
import { Color, Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import objectHash from 'object-hash';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import ChartTooltip from '@tremor/react/dist/components/chart-elements/common/ChartTooltip';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';
import { UnoChartTooltip } from '../ChartLegend';
import { ChartTooltipType, LegendFormatType } from '../constants';
import { NoData } from '../NoData';
import { CardLoading } from '../CardLoading';
import { formatTicks, getValueFormatted, renderLegendText } from '../utils';

type XAxisPrimaryFormatter = {
    (input: string): string;
};

export type ChartBarSettings<TDataIn> = {
    rawData?: TDataIn;
    tooltip?: ChartTooltipType;
    colors?: Color[];
    legendFormatType?: LegendFormatType;
    dataCallback?: (data: TDataIn) => Record<string, unknown>[];
    legend?: boolean;
    domain?: number;
    unit?: string;
    barSize?: number;
    xAxis?: boolean;
    multiXAxis?: {
        primary: XAxisPrimaryFormatter;
        secondary: (props: any) => ReactElement<SVGElement>;
    };
    stacked?: boolean;
    onClick?: (e: any) => void;
    onLegendClick?: (e: any) => void;
    hasTitle?: boolean;
    accumulated?: boolean;
    scroll?: boolean;
    refLineY?: { value: number; label: string; color: string };
    isLoading?: boolean;
    className?: string;
};

export const ChartBar = ({
    rawData,
    dataCallback,
    colors,
    legend,
    domain,
    unit = '',
    barSize = 50,
    xAxis = true,
    multiXAxis,
    stacked,
    onClick,
    onLegendClick,
    hasTitle,
    tooltip = 'classic',
    legendFormatType,
    accumulated = false,
    scroll = false,
    isLoading = false,
    refLineY,
    className,
}: ChartBarSettings<any>) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const dataStore: Record<string, unknown>[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const keys = dataStore.length > 0 ? Object.keys(dataStore[0]).filter((property) => property !== 'name') : [];
    const categoryColors = constructCategoryColors(keys, colors ?? themeColorRange);

    return (
        <Flex className={twMerge('w-full h-60', className)}>
            {isLoading && <CardLoading />}
            {!isLoading && dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <BarChart data={dataStore} maxBarSize={barSize} onClick={onClick}>
                        {xAxis && !multiXAxis && <XAxis dataKey='name' />}
                        {xAxis && multiXAxis && <XAxis dataKey='name' tickFormatter={multiXAxis.primary} />}
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
                            tickFormatter={(t: any) => (legendFormatType ? formatTicks(t, legendFormatType) : t)}
                            type='number'
                            domain={[0, domain ?? 'auto']}
                            unit={unit}
                            allowDecimals={false}
                            width={70}
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
                                        title={hasTitle}
                                        accumulated={accumulated}
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
                        />
                        {legend && (
                            <Legend
                                iconType='circle'
                                onClick={(onLegendClick as any) ?? null}
                                formatter={(v: any) => renderLegendText(humanize(v), !!onLegendClick)}
                                height={legendHeight}
                                content={({ payload }) => ChartLegend({ payload }, categoryColors, setLegendHeight)}
                            />
                        )}
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
                                    {dataStore.map((item) => (
                                        <Cell key={objectHash(item)} />
                                    ))}
                                </Bar>
                            ),
                        )}
                        {scroll && (
                            <Brush dataKey='name' height={15} stroke='#f1f2f3' endIndex={11} travellerWidth={10} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                !isLoading && <NoData />
            )}
        </Flex>
    );
};
