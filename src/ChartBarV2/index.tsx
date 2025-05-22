import type React from "react";
import { ResponsiveContainer } from "recharts";
import { twMerge } from "tailwind-merge";
import { ChartBarShimmer } from "../ChartShimmers";
import type { ChartComponent } from "../constants";
import { Flex } from "../Flex";
import { useChart } from "../hooks";
import { NoData } from "../NoData";
import Bar from "../Unochart/Bar";
import BarChart from "../Unochart/BarChart";
import { BaseColors } from "../theme";
import XAxis from "../Unochart/XAxis";
import YAxis from "../Unochart/YAxis";
import Tooltip from "../Unochart/Tooltip";
import Legend from "../Unochart/Legend";
import ReferenceLine from "../Unochart/ReferenceLine";

type RefLineY = {
  value: number;
  label?: string;
  color?: string;
};

type ChartBarSettings<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    width?: number;
    height?: number;
    margin?: { top: number; right: number; bottom: number; left: number };
    stacked?: boolean;
    barCategoryGap?: string;
    barGap?: number;
    layout?: 'horizontal' | 'vertical';
    refLineY?: RefLineY;
    onClick?: (activeLabel: string, activeTooltipIndex: number) => void;
};

export const ChartBarV2 = <T,>({
    rawData,
    dataCallback,
    width = 406,
    height = 240,
    barCategoryGap = '60%',
    barGap = 1,
    layout = 'horizontal',
    stacked,
    refLineY,
    onClick,
    className,
}: ChartBarSettings<T>) => {
    const [dataStore, categoryColors, keys] = useChart(rawData, dataCallback);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const onClickEvent = (event: any) => {
        if (event?.activeLabel && onClick) onClick(String(event.activeLabel), Number(event.activeTooltipIndex));
    };

    if (!rawData) return <ChartBarShimmer className={className} />;

    return (
        <Flex className={twMerge('w-full h-50', className)}>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                     <BarChart
                            data={dataStore}
                            width={width}
                            height={height}
                            barCategoryGap={barCategoryGap}
                            barGap={barGap}
                            layout={layout}
                        >
                            <XAxis />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {keys.map((property) =>
                                stacked ? (
                                        <Bar 
                                            dataKey={property}
                                            key={property}
                                            stackId='a' 
                                            fill={categoryColors.get(property) ?? BaseColors.Gray} 
                                        />
                                ):(
                                    <Bar 
                                            dataKey={property}
                                            key={property}
                                            fill={categoryColors.get(property) ?? BaseColors.Gray} 
                                        />
                                ),
                            )}
                            {refLineY && (
                                <ReferenceLine key='refLineY' label={refLineY.label} stroke={refLineY.color} y={refLineY.value}/>
                            )}
                        </BarChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
