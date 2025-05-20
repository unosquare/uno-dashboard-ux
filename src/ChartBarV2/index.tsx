import type React from "react";
import { ResponsiveContainer, BarChart } from "recharts";
import { twMerge } from "tailwind-merge";
import { ChartBarShimmer } from "../ChartShimmers";
import type { ChartComponent } from "../constants";
import { Flex } from "../Flex";
import { useChart } from "../hooks";
import { NoData } from "../NoData";
import BarV2 from "../Recharts/BarV2";
import BarChartV2 from "../Recharts/BarChartV2";
import { BaseColors } from "../theme";
import XAxisV2 from "../Recharts/XAxisV2";
import YAxisV2 from "../Recharts/YAxisV2";
import TooltipV2 from "../Recharts/TooltipV2";
import LegendV2 from "../Recharts/LegendV2";
import ReferenceLineV2 from "../Recharts/ReferenceLineV2";

type RefLineY = {
  value: number;
  label?: string;
  color?: string;
};

export type ChartBarSettingsV2<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
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
}: ChartBarSettingsV2<T>) => {
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
                     <BarChartV2
                            data={dataStore}
                            width={width}
                            height={height}
                            barCategoryGap={barCategoryGap}
                            barGap={barGap}
                            layout={layout}
                        >
                            <XAxisV2 />
                            <YAxisV2 />
                            <TooltipV2 />
                            <LegendV2 />
                            {keys.map((property) =>
                                stacked ? (
                                        <BarV2 
                                            dataKey={property}
                                            key={property}
                                            stackId='a' 
                                            fill={categoryColors.get(property) ?? BaseColors.Gray} 
                                        />
                                ):(
                                    <BarV2 
                                            dataKey={property}
                                            key={property}
                                            fill={categoryColors.get(property) ?? BaseColors.Gray} 
                                        />
                                ),
                            )}
                            {refLineY && (
                                <ReferenceLineV2 key='refLineY' label={refLineY.label} stroke={refLineY.color} y={refLineY.value}/>
                            )}
                        </BarChartV2>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
