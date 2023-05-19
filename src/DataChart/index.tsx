import objectHash from 'object-hash';
import React from 'react';
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
import tw from 'tailwind-styled-components';
import { Dictionary } from 'uno-js';
import { ChartLegend } from '../ChartLegend';
import { ChartComponent, ChartTypes } from '../constants';
import { CardLoading } from '../CardLoading';
import { NoData } from '../NoData';
import { defaultChartPalette } from '../theme';
import { formatTicks, StyledChartTitle } from '../ChartBar';

export interface DataChartSettings<TDataIn> extends ChartComponent<TDataIn, Dictionary[]> {
    legend?: boolean;
    title?: string;
    onClick?: (e: any) => void;
    domain?: number;
    unit?: string;
    onLegendClick?: (e: any) => void;
    refLineY?: { value: number; label: string; color: string };
    isLoading?: boolean;
}

interface LegendSettings {
    $clickable?: boolean;
}

const StyledChart = tw.div`
    flex
    flex-col
    items-center
    justify-center
    w-full
    h-full
    -ml-[30px]
`;

const StyledLegend = tw.span<LegendSettings>`
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

export const getChartSeries = (data: any) =>
    data.reduce((current: any[], serie: any) => {
        Object.keys(serie)
            .filter((property) => property !== 'name')
            .forEach((entry) => {
                if (!current.includes(entry)) current.push(entry);
            });
        return current;
    }, []);

const renderLegendText = (value: string, clickable: boolean) => (
    <StyledLegend $clickable={clickable}>{value}</StyledLegend>
);

export const DataChart = ({
    dataCallback,
    rawData,
    colors = defaultChartPalette,
    legend,
    title,
    onClick,
    legendFormatType,
    domain,
    unit,
    onLegendClick,
    refLineY,
    isLoading,
}: DataChartSettings<any>) => {
    const dataStore: Dictionary[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(t, legendFormatType) : t);

    return (
        <StyledChart>
            {title && <StyledChartTitle>{title}</StyledChartTitle>}
            {isLoading && <CardLoading />}
            {!isLoading && dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <LineChart data={dataStore} margin={margin} onClick={onClick}>
                        <CartesianGrid strokeDasharray='2 2' />
                        <XAxis dataKey='name' padding={xPadding} />
                        <YAxis
                            tickFormatter={tickFormatter}
                            type='number'
                            domain={[0, domain || 'auto']}
                            unit={unit}
                            allowDecimals={false}
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
                            content={<ChartLegend type={ChartTypes.LINE} legendFormatType={legendFormatType} />}
                            isAnimationActive={false}
                        />
                        {(onLegendClick || legend) && (
                            <Legend
                                iconType='circle'
                                onClick={onLegendClick}
                                formatter={(v: any) => renderLegendText(v, !!onLegendClick)}
                            />
                        )}
                        {getChartSeries(dataStore).map((property: any, index: number) => (
                            <Line
                                type='monotone'
                                dataKey={property}
                                stroke={colors[index]}
                                key={objectHash(property)}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                !isLoading && <NoData />
            )}
        </StyledChart>
    );
};
