import React, { type ReactNode } from "react";
import type { ChartComponent } from "../constants";
import { useChart } from "../hooks";
import { ChartLineShimmer } from "../ChartShimmers";
import { twMerge } from "tailwind-merge";
import { Flex } from "../Flex";
import LineChart from "../Unochart/LineChart";
import CartesianGrid from "../Unochart/CartesianGrid";
import XAxis from "../Unochart/XAxis";
import YAxis from "../Unochart/YAxis";
import Line, { type LinePointClickEvent } from "../Unochart/Line";
import { NoData } from "../NoData";
import Tooltip from "../Unochart/Tooltip";
import Legend from "../Unochart/Legend";
import { ResponsiveContainer } from "recharts";
import { BaseColors } from "../theme";

type DataChartSettings<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    onClick?: (event: LinePointClickEvent<{ [key: string]: any }>) => void;
    additionalComponents?: ReactNode[];
    width?: number;
    height?: number;
    margin?: margin;
};

type margin = {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
};

export const DataChartV2 = <T,>({
    dataCallback,
    rawData,
    onClick,
    className,
    width = 406,
    height = 240,
    margin = {top: 0, right: 0, left: 0, bottom: 0},
    additionalComponents = [],
}: DataChartSettings<T>) => {
    const [dataStore, categoryColors, keys] = useChart(rawData, dataCallback);

    if (!rawData) return <ChartLineShimmer className={className} />;
    console.log('keys', keys);
    return (
        <Flex className={twMerge('w-full h-50', className)}>
            {dataStore.length > 0 ? (
                    <ResponsiveContainer>
                        <LineChart width={width} height={height} data={dataStore} margin={margin}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='name' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {keys.map((property) => (
                                <Line
                                    key={property}
                                    type='monotone'
                                    dataKey={property}
                                    stroke={categoryColors.get(property) ?? BaseColors.Gray}
                                    strokeDasharray=' '
                                    connectNulls={false}
                                    label={true}
                                    onClick={onClick ? (event => onClick(event as LinePointClickEvent<{ [key: string]: any }>)) : undefined}
                                />
                            ))}
                            {additionalComponents}
                        </LineChart>
                    </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
