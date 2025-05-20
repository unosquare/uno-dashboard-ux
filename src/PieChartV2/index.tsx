import react, { useMemo } from "react";
import type { ChartComponent, ChartData } from "../constants";
import { BaseColors, colorPalette, constructCategoryColors, getColorClassNames, themeColorRange } from "../theme";
import { Flex } from "../Flex";
import { NoData } from "../NoData";
import { PolarGrid, ResponsiveContainer, Tooltip } from "recharts";
import { twMerge } from "tailwind-merge";
import PieChartRechartV2 from "../Recharts/PieChartRechartV2";
import PieV2 from "../Recharts/PieV2";
import TooltipV2 from "../Recharts/TooltipV2";
import LegendV2 from "../Recharts/LegendV2";

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

export type PieChartV2Props<T> = ChartComponent<T, ChartData[]> & {
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
}: PieChartV2Props<T>) => {
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
                <PieChartRechartV2 width={width} height={height}>
                    {showPolarGrid && <PolarGrid />}
                    {initialPies.map((pie, index) => (
                        <PieV2
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
                    <TooltipV2 />
                    <LegendV2 />
                </PieChartRechartV2>
            </ResponsiveContainer>
        </div>
    );
};
