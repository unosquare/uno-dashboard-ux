import type React from "react";
import { useMemo, useRef, useState } from "react";
import type { ChartComponent, ChartData } from "../constants";
import { BaseColors, constructCategoryColors, themeColorRange } from "../theme";
import { Flex } from "../Flex";
import { NoData } from "../NoData";
import { PolarGrid, ResponsiveContainer } from "recharts";
import { twMerge } from "tailwind-merge";
import PieChart from "../Unochart/PieChart";
import Pie, { type PieClickEvent } from "../Unochart/Pie";
import Tooltip from "../Unochart/Tooltip";
import Legend from "../Unochart/Legend";
import { v4 as uuidv4 } from "uuid";

type PieChartProps<T> = ChartComponent<T, ChartData[]> & {
    innerRadius?: number;
    outerRadius?: number;
    cx?: string | number;
    cy?: string | number;
    showLabels?: boolean;
    startAngle?: number;
    endAngle?: number;
    paddingAngle?: number;
    activeShape?: boolean;
    showPolarGrid?: boolean;
    width?: number;
    height?: number;
    onClick?: (event: PieClickEvent) => void;
};

export const PieChartV2 = <T,>({
    innerRadius = 0,
    outerRadius = 80,
    cx = '50%',
    cy = '50%',
    showLabels = false,
    width = 406,
    height = 240,
    rawData,
    dataCallback,
    className,
    showPolarGrid = false,
    startAngle,
    endAngle,
    paddingAngle,
    activeShape,
    onClick,
}: PieChartProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltipData, setTooltipData] = useState<{
            name: string;
            values: { key: string; value: number; color: string }[];
        } | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const dataTransformFn = useMemo(
        () => dataCallback ?? ((data: T) => data as unknown as ChartData[]),
        [dataCallback],
    );
    const dataStore: ChartData[] = (rawData && dataTransformFn(rawData)) || [];
    const names = dataStore.map(item => item.name);
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

    let cyValue = 0;
    if (typeof cy === 'number') {
        cyValue = cy;
    } else if (typeof cy === 'string' && cy.endsWith('%')) {
        cyValue = (parseFloat(cy) / 100) * height;
    } else {
        cyValue = Number(cy) || height / 2;
    }

    const handleMouseMove = (event: React.MouseEvent<SVGGElement>, entry: { name: string; value: number }, dataKey: string) => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        const x = event.clientX - containerRect.left;
        const y = event.clientY - containerRect.top + cyValue;

        const values = [{
            key: dataKey,
            value: entry.value,
            color: categoryColors.get(entry.name) ?? BaseColors.Gray,
        }];

        setTooltipData({ name: entry.name, values });
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    return (
        <div ref={containerRef} className={twMerge('h-60', className)}>
            <ResponsiveContainer>
                <>
                    <PieChart width={width} height={height}>
                        {showPolarGrid && <PolarGrid />}
                        <Pie
                            key={uuidv4()}
                            data={dataStore}
                            dataKey='value'
                            nameKey='name'
                            cx={cx}
                            cy={cy}
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            paddingAngle={paddingAngle}
                            fill={categoryColors.get(dataStore[0]?.name) ?? BaseColors.Gray}
                            showLabels={showLabels}
                            label={names}
                            activeShape={activeShape}
                            onClick={onClick}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        />
                    </PieChart>
                    <Legend />
                    <Tooltip tooltipData={tooltipData} position={position} />
                </>
            </ResponsiveContainer>
        </div>
    );
};
