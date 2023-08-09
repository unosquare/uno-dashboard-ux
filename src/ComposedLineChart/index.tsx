import React from 'react';
import {
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
import tw from 'tailwind-styled-components';
import { FormatTypes } from 'uno-js';
import { Flex } from '@tremor/react';
import { CardLoading } from '../CardLoading';
import { ChartLegend } from '../ChartLegend';
import { NoData } from '../NoData';
import { ChartComponent, LegendFormatTypes } from '../constants';
import { defaultChartPalette } from '../theme';
import { formatTicks } from '../utils';

export type legendXAxis = { left: LegendFormatTypes; right: LegendFormatTypes };
export type lineChart = { dataKey: string; yAxisId: string };

interface ComposedLineChartSettings<TDataIn> extends ChartComponent<TDataIn, Record<string, unknown>[]> {
    legend?: boolean;
    onClick?: (e: any) => void;
    domain?: number;
    unit?: string;
    onLegendClick?: (e: any) => void;
    refLineY?: { value: number; label: string; color: string };
    isLoading?: boolean;
    formats?: FormatTypes[];
    legendFormatTypes?: legendXAxis;
    lines: lineChart[];
}

const StyledLegend = tw.span<{ $clickable?: boolean }>`
    text-maingray
    ${({ $clickable }) => $clickable && 'cursor-pointer'}
`;

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

const renderLegendText = (value: string, clickable: boolean) => (
    <StyledLegend $clickable={clickable}>{value}</StyledLegend>
);

export const ComposedLineChart = ({
    dataCallback,
    rawData,
    legend,
    onClick,
    legendFormatTypes,
    domain,
    unit,
    onLegendClick,
    refLineY,
    isLoading,
    formats,
    lines,
}: ComposedLineChartSettings<any>) => {
    const dataStore: Record<string, unknown>[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const tickFormatter = (t: any, orientation: 'left' | 'right') =>
        legendFormatTypes ? formatTicks(t, (legendFormatTypes as any)[orientation]) : t;

    return (
        <Flex className='w-full h-48'>
            {isLoading && <CardLoading />}
            {!isLoading && dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <ComposedChart data={dataStore} margin={margin} onClick={onClick}>
                        {lines.map((property: lineChart, index: number) => (
                            <Line
                                type='monotone'
                                dataKey={property.dataKey}
                                stroke={defaultChartPalette[index]}
                                key={property.dataKey}
                                yAxisId={property.yAxisId}
                            />
                        ))}
                        <CartesianGrid strokeDasharray='2 2' />
                        <XAxis dataKey='name' padding={xPadding} />
                        <YAxis
                            yAxisId='left'
                            tickFormatter={(t: any) => tickFormatter(t, 'left')}
                            type='number'
                            domain={[0, domain || 'auto']}
                            unit={unit}
                            allowDecimals={false}
                        />
                        <YAxis
                            yAxisId='right'
                            tickFormatter={(t: any) => tickFormatter(t, 'right')}
                            type='number'
                            domain={[0, 'auto']}
                            unit={unit}
                            allowDecimals
                            orientation='right'
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
                            offset={30}
                            content={<ChartLegend type='line' formats={formats} />}
                            isAnimationActive={false}
                        />
                        {(onLegendClick || legend) && (
                            <Legend
                                iconType='circle'
                                onClick={onLegendClick}
                                formatter={(v: any) => renderLegendText(v, !!onLegendClick)}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                !isLoading && <NoData />
            )}
        </Flex>
    );
};
