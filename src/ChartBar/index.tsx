import React from 'react';
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
import { Dictionary, formatter, humanize } from 'uno-js';
import { Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import { ChartLegend } from '../ChartLegend';
import { LegendFormatTypes } from '../constants';
import { NoData } from '../NoData';
import { defaultChartPalette } from '../theme';
import { CardLoading } from '../CardLoading';
import { translateFormat } from '../utils';

export const formatTicks = (t: any, formatType: LegendFormatTypes) => {
    if (formatType === 'money') {
        if (t >= 1000000) return `${t / 1000000}M`;

        return t >= 1000 ? `${t / 1000}K` : formatter(t, 'money');
    }

    return formatter(t, translateFormat(formatType));
};

interface XAxisPrimaryFormatter {
    (input: string): string;
}

interface XAxisSecondaryFormatter {
    (e: any): void;
}

export interface ChartBarSettings<TDataIn> {
    rawData?: TDataIn;
    colors?: string[];
    legendFormatType?: LegendFormatTypes;
    dataCallback?: (data: TDataIn) => Dictionary[];
    legend?: boolean;
    domain?: number;
    unit?: string;
    barSize?: number;
    xAxis?: boolean;
    multiXAxis?: {
        primary: XAxisPrimaryFormatter;
        secondary: XAxisSecondaryFormatter;
    };
    stacked?: boolean;
    onClick?: (e: any) => void;
    onBarClick?: (e: any, bar: number) => void;
    onLegendClick?: (e: any) => void;
    hasTitle?: boolean;
    tooltipOffset?: number;
    accumulated?: boolean;
    scroll?: boolean;
    refLineY?: { value: number; label: string; color: string };
    isLoading?: boolean;
    className?: string;
}

const renderLegendText = (value: string, clickable: boolean) => (
    <span className={`text-[#333333] ${clickable && 'cursor-pointer'}`}>{value}</span>
);

const chart4Colors = ['#003de6', '#ea00a1', '#ff414f', '#ffa600'];

export const ChartBar = ({
    rawData,
    dataCallback,
    colors = undefined,
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
    legendFormatType,
    onBarClick,
    tooltipOffset = 10,
    accumulated = false,
    scroll = false,
    isLoading = false,
    refLineY,
    className,
}: ChartBarSettings<any>) => {
    const dataStore: Dictionary[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const keys = dataStore.length > 0 ? Object.keys(dataStore[0]).filter((property) => property !== 'name') : [];

    if (!colors) colors = keys.length === 4 ? chart4Colors : defaultChartPalette;

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
                            domain={[0, domain || 'auto']}
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
                            content={
                                <ChartLegend
                                    type='bar'
                                    legendFormatType={legendFormatType}
                                    title={hasTitle}
                                    accumulated={accumulated}
                                />
                            }
                            offset={tooltipOffset}
                        />
                        {legend && (
                            <Legend
                                iconType='circle'
                                onClick={onLegendClick || null}
                                formatter={(v: any) => renderLegendText(humanize(v), !!onLegendClick)}
                            />
                        )}
                        {keys.map((property, index) =>
                            stacked ? (
                                <Bar dataKey={property} fill={colors![index]} key={index} stackId='a' />
                            ) : (
                                <Bar
                                    onClick={onBarClick ? (e: any) => onBarClick(e, index) : null}
                                    dataKey={property}
                                    fill={colors![index]}
                                    key={index}
                                >
                                    {dataStore.map((_, i) => (
                                        <Cell
                                            cursor={onBarClick && 'pointer'}
                                            fill={colors![index]}
                                            key={`cell-${i}`}
                                        />
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
