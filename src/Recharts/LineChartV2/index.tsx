import React, { Children, cloneElement, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { roundMaxValue } from "../BarChartV2/utils";
import XAxisV2 from "../XAxisV2";
import YAxisV2 from "../YAxisV2";
import CartesianGridV2 from "../CartesianGridV2";
import TooltipV2 from "../TooltipV2";
import LegendV2 from "../LegendV2";
import LineV2 from "../LineV2";
import ReferenceLineV2 from "../ReferenceLineV2";

interface LineChartV2Props {
    width: number;
    height: number;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data: Array<{ [key: string]: any }>;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    children: ReactNode;
}

const LineChartV2: React.FC<LineChartV2Props> = ({
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

    const xAxis = childrenArray.find((child) => React.isValidElement(child) && child.type === XAxisV2);
    const yAxis = childrenArray.find((child) => React.isValidElement(child) && child.type === YAxisV2);
    const grid = childrenArray.find((child) => React.isValidElement(child) && child.type === CartesianGridV2);
    const tooltip = childrenArray.find((child) => React.isValidElement(child) && child.type === TooltipV2);
    const legend = childrenArray.find((child) => React.isValidElement(child) && child.type === LegendV2);

    const lineComponents = childrenArray.filter((child) => React.isValidElement(child) && child.type === LineV2);

    const referenceLines = childrenArray.filter((child) => React.isValidElement(child) && child.type === ReferenceLineV2);

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
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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
                        React.isValidElement(child) && child.type === LineV2
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
            {tooltip && <TooltipV2 tooltipData={tooltipData} position={position} />}
        </div>
    );
};

export default LineChartV2;
