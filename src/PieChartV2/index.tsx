import React, { useMemo } from "react";
import type { ChartComponent, ChartData } from "../constants";
import { BaseColors, colorPalette, constructCategoryColors, getColorClassNames, themeColorRange } from "../theme";
import { Flex } from "../Flex";
import { NoData } from "../NoData";
import { PolarGrid, ResponsiveContainer } from "recharts";
import { twMerge } from "tailwind-merge";
import PieChartRechart from "../Unochart/PieChartRechart";
import Pie from "../Unochart/Pie";
import Tooltip from "../Unochart/Tooltip";
import Legend from "../Unochart/Legend";

export interface PieData {
    id: number;
    innerRadius?: number;
    outerRadius?: number;
    cx?: string | number;
    cy?: string | number;
    showLabels?: boolean;
    startAngle?: number;
    endAngle?: number;
    activeShape?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    label?: string | ((data: any) => string);
}

type PieChartProps<T> = ChartComponent<T, ChartData[]> & {
    initialPies?: PieData[];
    showPolarGrid?: boolean;
    width?: number;
    height?: number;
};

export const PieChartV2 = <T,>({
    initialPies = [{ id: 1, innerRadius: 0, outerRadius: 80, cx: '50%', cy: '50%', showLabels: true }],
    width = 406,
    height = 240,
    rawData,
    dataCallback,
    className,
    showPolarGrid = false,
}: PieChartProps<T>) => {
    const dataTransformFn = useMemo(
        () => dataCallback ?? ((data: T) => data as unknown as ChartData[]),
        [dataCallback],
    );
    const dataStore: ChartData[] = (rawData && dataTransformFn(rawData)) || [];
    const categoryColors = constructCategoryColors(
        dataStore.map((x) => x.name),
        themeColorRange,
    );

    if (!rawData) {
        return (
            <Flex alignItems='center' justifyContent='center' className={twMerge('h-60', className)}>
                <div className='h-60 w-60 content-center loading-shimmer rounded-full'>&nbsp;</div>
            </Flex>
        );
    }

    if (dataStore.length === 0) return <NoData />;

    return (
        <div className={twMerge('h-60', className)}>
            <ResponsiveContainer>
                <PieChartRechart width={width} height={height}>
                    {showPolarGrid && <PolarGrid />}
                    {initialPies.map((pie, index) => (
                        <Pie
                            key={pie.id}
                            data={dataStore}
                            dataKey='value'
                            nameKey='name'
                            cx={pie.cx}
                            cy={pie.cy}
                            innerRadius={pie.innerRadius}
                            outerRadius={pie.outerRadius}
                            startAngle={pie.startAngle}
                            endAngle={pie.endAngle}
                            paddingAngle={pie.paddingAngle}
                            fill='blue'
                            label={pie.showLabels ? pie.label || undefined : undefined}
                            activeShape={pie.activeShape}
                        />
                    ))}
                    <Tooltip />
                    <Legend />
                </PieChartRechart>
            </ResponsiveContainer>
        </div>
    );
};
