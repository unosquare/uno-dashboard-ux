import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, Cell, Brush } from 'recharts';
import tw from 'tailwind-styled-components';
import { Dictionary, humanize } from 'uno-js';
import { ChartLegend } from '../ChartLegend';
import { ChartTypes, LegendFormatTypes } from '../constants';
import { formatTicks } from '../DataChart';
import { NoData } from '../NoData';
import { defaultChartPalette, baseTheme } from '../theme';

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
    title?: string;
    onClick?: (e: any) => void;
    onBarClick?: (e: any, bar: number) => void;
    onLegendClick?: (e: any) => void;
    hasTitle?: boolean;
    tooltipOffset?: number;
    accumulated?: boolean;
    scroll?: boolean;
}

interface LegendSettings {
    $clickable: boolean;
}

const StyledChartTitle = tw.h6`
    m-0
    text-base
    font-medium
`;

const StyledChart = tw.div`
    flex
    flex-col
    items-center
    justify-center
    w-full
    h-full
`;

const StyledLegend = tw.span<LegendSettings>`
    text-[#333333]
    ${({ $clickable }) => $clickable && 'cursor-pointer'}
`;

const renderLegendText = (value: string, clickable: boolean) => (
    <StyledLegend $clickable={clickable}>{value}</StyledLegend>
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
    title,
    onClick,
    onLegendClick,
    hasTitle,
    legendFormatType,
    onBarClick,
    tooltipOffset = 10,
    accumulated = false,
    scroll = false,
}: ChartBarSettings<any>) => {
    const dataStore: Dictionary[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const keys = dataStore.length > 0 ? Object.keys(dataStore[0]).filter((property) => property !== 'name') : [];

    if (!colors) colors = keys.length === 4 ? chart4Colors : defaultChartPalette;

    return (
        <StyledChart>
            {title && <StyledChartTitle>{title}</StyledChartTitle>}
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <BarChart
                        data={dataStore}
                        margin={{
                            top: 5,
                            right: 30,
                            left: -10,
                            bottom: 5,
                        }}
                        maxBarSize={barSize}
                        onClick={onClick}
                    >
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
                        <Tooltip
                            content={
                                <ChartLegend
                                    type={ChartTypes.BAR}
                                    legendFormatType={legendFormatType}
                                    title={hasTitle}
                                    accumulated={accumulated}
                                />
                            }
                            offset={tooltipOffset}
                        />
                        {onLegendClick ? (
                            <Legend
                                iconType='circle'
                                onClick={onLegendClick}
                                formatter={(v: any) => renderLegendText(humanize(v), !!onLegendClick)}
                            />
                        ) : (
                            legend && (
                                <Legend
                                    iconType='circle'
                                    formatter={(v: any) => renderLegendText(humanize(v), !!onLegendClick)}
                                />
                            )
                        )}
                        {legend && <Legend iconType='circle' />}
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
                            <Brush
                                dataKey='name'
                                height={15}
                                stroke={baseTheme.colors.table}
                                endIndex={11}
                                travellerWidth={10}
                            />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </StyledChart>
    );
};
