import React, { Children, cloneElement, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { roundMaxValue } from "../BarChart/utils";
import XAxis from "../XAxis";
import YAxis from "../YAxis";
import CartesianGrid from "../CartesianGrid";
import Tooltip from "../Tooltip";
import Legend from "../Legend";
import Line from "../Line";
import ReferenceLine from "../ReferenceLine";

interface LineChartProps {
    width: number;
    height: number;
    data: Array<{ [key: string]: any }>;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    children: ReactNode;
}

const LineChart: React.FC<LineChartProps> = ({
    width,
    height,
    data,
    margin = { top: 20, right: 30, bottom: 20, left: 40 },
    children,
}) => {
    const chartWidth = width - ((margin.left ?? 0) + (margin.right ?? 0) + 20);
    const chartHeight = height - ((margin.top ?? 0) + (margin.bottom ?? 0) + 20);

    const { maxValue, minValue } = useMemo(() => roundMaxValue(data), [data]);
    const [leftMargin, setLeftMargin] = useState(margin.left);
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltipData, setTooltipData] = useState<{
        name: string;
        values: { key: string; value: number; color: string }[];
    } | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        if (svgRef.current) {
            const yAxisLabels = svgRef.current.querySelectorAll('.y-axis text');
            const maxWidth = Array.from(yAxisLabels).reduce((maxWidth, text) => {
                const width = (text as SVGTextElement).getBBox().width;
                return Math.max(maxWidth, width);
            }, 0);
            setLeftMargin(maxWidth + (margin.left ?? 0) * 0.5);
        }
    }, [data, margin.left]);

    const childrenArray = useMemo(() => Children.toArray(children), [children]);

    const xAxis = childrenArray.find((child) => React.isValidElement(child) && child.type === XAxis);
    const yAxis = childrenArray.find((child) => React.isValidElement(child) && child.type === YAxis);
    const grid = childrenArray.find((child) => React.isValidElement(child) && child.type === CartesianGrid);
    const tooltip = childrenArray.find((child) => React.isValidElement(child) && child.type === Tooltip);
    const legend = childrenArray.find((child) => React.isValidElement(child) && child.type === Legend);

    const lineComponents = childrenArray.filter((child) => React.isValidElement(child) && child.type === Line);

    const referenceLines = childrenArray.filter((child) => React.isValidElement(child) && child.type === ReferenceLine);

    const legendItems = useMemo(
        () =>
            lineComponents.map((child) => {
                if (React.isValidElement(child)) {
                    const lineChild = child as React.ReactElement;
                    return { color: lineChild.props.stroke, label: lineChild.props.dataKey };
                }
                return { color: '', label: '' };
            }),
        [lineComponents],
    );

    const xScale = (value: string | number) => {
        if (typeof value === 'string') {
            const index = data.findIndex((item) => item.name === value);
            return (index + 0.5) * (chartWidth / data.length);
        }
        return (value + 0.5) * (chartWidth / data.length);
    };

    const yScale = (value: number) => chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;

        const mouseX = event.clientX - svgRect.left - (leftMargin ?? 0);
        const xScale = chartWidth / (data.length - 1);
        const index = Math.round(mouseX / xScale);

        if (index >= 0 && index < data.length) {
            const entry = data[index];
            const values = lineComponents
                .map((child) => {
                    if (React.isValidElement(child)) {
                        const lineChild = child as React.ReactElement;
                        const dataKey = lineChild.props.dataKey;
                        return {
                            key: dataKey,
                            value: entry[dataKey],
                            color: lineChild.props.stroke,
                        };
                    }
                    return null;
                })
                .filter((v): v is { key: string; value: number; color: string } => v !== null);

            setTooltipData({ name: entry.name, values });
            setPosition({ x: event.clientX - svgRect.left, y: event.clientY - svgRect.top });
        }
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    return (
        <div className='relative inline-block'>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className='bg-white transition-all duration-300 ease-in-out'
                style={{ overflow: 'visible' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <g transform={`translate(${(leftMargin ?? 0) + 10}, ${(margin.top ?? 0) + 10})`}>
                    {grid && cloneElement(grid as React.ReactElement, { width: chartWidth, height: chartHeight })}
                    {xAxis &&
                        cloneElement(xAxis as React.ReactElement, { data, width: chartWidth, height: chartHeight })}
                    {yAxis && cloneElement(yAxis as React.ReactElement, { height: chartHeight, minValue, maxValue })}
                    {Children.map(children, (child) =>
                        React.isValidElement(child) && child.type === Line
                            ? cloneElement(child as React.ReactElement<any>, {
                                  data,
                                  chartWidth,
                                  chartHeight,
                                  xScale,
                                  yScale,
                              })
                            : null,
                    )}
                    {referenceLines.map((referenceLine) =>
                        React.isValidElement(referenceLine)
                            ? cloneElement(referenceLine as React.ReactElement, {
                                  key: referenceLine.props.id || referenceLine.props.dataKey,
                                  chartWidth,
                                  chartHeight,
                                  xScale,
                                  yScale,
                              })
                            : null,
                    )}
                </g>
            </svg>
            {legend && cloneElement(legend as React.ReactElement, { items: legendItems })}
            {tooltip && <Tooltip tooltipData={tooltipData} position={position} />}
        </div>
    );
};

export default LineChart;
