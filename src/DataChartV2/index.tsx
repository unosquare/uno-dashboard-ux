import React, { type ReactNode } from "react";
import type { ChartComponent } from "../constants";
import { useChart } from "../hooks";
import { ChartLineShimmer } from "../ChartShimmers";
import { twMerge } from "tailwind-merge";
import { Flex } from "../Flex";
import LineChartV2 from "../Recharts/LineChartV2";
import CartesianGridV2 from "../Recharts/CartesianGridV2";
import XAxisV2 from "../Recharts/XAxisV2";
import YAxisV2 from "../Recharts/YAxisV2";
import LineV2 from "../Recharts/LineV2";
import { NoData } from "../NoData";
import TooltipV2 from "../Recharts/TooltipV2";
import LegendV2 from "../Recharts/LegendV2";

export type DataChartSettingsV2<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    onClick?: (activeTooltipIndex: number, activeLabel: string) => void;
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
    margin = {top: 5, right: 30, left: 20, bottom: 5},
    additionalComponents = [],
}: DataChartSettingsV2<T>) => {
    const [dataStore, categoryColors, keys] = useChart(rawData, dataCallback);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const onClickEvent = (event: any) => {
        if (event?.activeTooltipIndex !== null && onClick)
            onClick(Number(event.activeTooltipIndex), String(event.activeLabel));
    };

    if (!rawData) return <ChartLineShimmer className={className} />;

    return (
        <Flex className={twMerge('w-full h-60', className)}>
            {dataStore.length > 0 ? (
                    <div className='bg-white'>
                        <LineChartV2 width={width} height={height} data={dataStore} margin={margin}>
                            <CartesianGridV2 strokeDasharray='2 2' />
                            <XAxisV2 dataKey='name' />
                            <YAxisV2 />
                            <TooltipV2 />
                            <LegendV2 />
                            {keys.map((property) => (
                                <LineV2
                                    key={property}
                                    type='monotone'
                                    dataKey={property}
                                    stroke={categoryColors.get(property) ?? 'blue'}
                                    strokeDasharray=''
                                    connectNulls={false}
                                    label={true}
                                />
                            ))}
                            {additionalComponents}
                        </LineChartV2>
                    </div>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
