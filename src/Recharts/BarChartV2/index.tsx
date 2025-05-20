import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BarV2 from '../BarV2';
import CartesianGridV2 from '../CartesianGridV2';
import LegendV2 from '../LegendV2';
import TooltipV2 from '../TooltipV2';
import XAxisV2 from '../XAxisV2';
import YAxisV2 from '../YAxisV2';
import {
    type ChartDataV2,
    DEFAULT_BAR_CATEGORY_GAP,
    DEFAULT_BAR_GAP,
    DEFAULT_HEIGHT,
    DEFAULT_LAYOUT,
    DEFAULT_MARGIN,
    DEFAULT_WIDTH,
} from '../../constants';
import { parseGap, roundMaxValue } from './utils';
import ReferenceLineV2 from '../ReferenceLineV2';

interface BarChartProps {
    data: ChartDataV2;
    width?: number;
    height?: number;
    children?: React.ReactNode;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    barCategoryGap?: string | number;
    barGap?: string | number;
    layout?: 'horizontal' | 'vertical';
}

const BarChartV2: React.FC<BarChartProps> = ({
    data,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    children,
    margin = { top: DEFAULT_MARGIN, right: DEFAULT_MARGIN, bottom: DEFAULT_MARGIN, left: DEFAULT_MARGIN },
    barCategoryGap = DEFAULT_BAR_CATEGORY_GAP,
    barGap = DEFAULT_BAR_GAP,
    layout = DEFAULT_LAYOUT,
}) => {
    const [tooltipData, setTooltipData] = useState<{
        name: string;
        values: { key: string; value: number; color: string }[];
    } | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [leftMargin, setLeftMargin] = useState(40);
    const [rightMargin, setRightMargin] = useState(margin.right ?? DEFAULT_MARGIN);
    const svgRef = useRef<SVGSVGElement>(null);
    const chartWidth = width - ((margin.left ?? 0) + (margin.right ?? 0) + 20);
    const chartHeight = height - ((margin.top ?? 0) + (margin.bottom ?? 0) + 20);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (svgRef.current) {
            const yAxisLabels = svgRef.current.querySelectorAll('.y-axis text');
            const maxWidth = Array.from(yAxisLabels).reduce((maxWidth, text) => {
                const width = (text as SVGTextElement).getBBox().width;
                return Math.max(maxWidth, width);
            }, 0);
            setLeftMargin(maxWidth + width * 0.025);
            setRightMargin(
                layout === 'vertical'
                    ? maxWidth + width * 0.1 + (margin.right ?? DEFAULT_MARGIN)
                    : (margin.right ?? DEFAULT_MARGIN),
            );
        }
    }, [data, layout, margin.right, width]);

    const hasStackedBars = React.Children.toArray(children).some(
        (child) => (child as React.ReactElement).props.stackId,
    );
    const { maxValue, minValue } = roundMaxValue(data, hasStackedBars);

    const xScale = (value: string | number) => {
        if (typeof value === 'string') {
            const index = data.findIndex((item) => item.name === value);
            return (index + 0.5) * (chartWidth / data.length);
        }
        return (value + 0.5) * (chartWidth / data.length);
    };

    const yScale = (value: number) => chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    const barComponents = React.Children.toArray(children).map((child) => {
        if ((child as React.ReactElement).type === BarV2 && !(child as React.ReactElement).props.stackId) {
            return React.cloneElement(child as React.ReactElement, { stackId: uuidv4() });
        }
        return child;
    });

    const groupedBarComponents: { [key: string]: React.ReactElement[] } = {};

    // biome-ignore lint/complexity/noForEach: <explanation>
    barComponents.forEach((child) => {
        if ((child as React.ReactElement).type === BarV2) {
            const stackId = (child as React.ReactElement).props.stackId;
            if (!groupedBarComponents[stackId]) {
                groupedBarComponents[stackId] = [];
            }
            groupedBarComponents[stackId].push(child as React.ReactElement);
        }
    });

    const xAxisComponent = React.Children.toArray(children).find(
        (child) => (child as React.ReactElement).type === XAxisV2,
    );
    const yAxisComponent = React.Children.toArray(children).find(
        (child) => (child as React.ReactElement).type === YAxisV2,
    );
    const cartesianGridComponent = React.Children.toArray(children).find(
        (child) => (child as React.ReactElement).type === CartesianGridV2,
    );
    const legendComponent = React.Children.toArray(children).find(
        (child) => (child as React.ReactElement).type === LegendV2,
    );
    const tooltipComponent = React.Children.toArray(children).find(
        (child) => (child as React.ReactElement).type === TooltipV2,
    );
    const referenceLines = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === ReferenceLineV2
    );

    const legendItems = barComponents.map((child) => {
        if (React.isValidElement(child)) {
            const barChild = child as React.ReactElement;
            return { color: barChild.props.fill, label: barChild.props.dataKey };
        }
        return { color: '', label: '' };
    });

    const handleMouseOver = (event: React.MouseEvent, entry: { name: string }) => {
        const values = barComponents
            .map((child) => {
                if (React.isValidElement(child)) {
                    const dataKey = (child as React.ReactElement).props.dataKey;
                    const value = data.find((d) => d.name === entry.name)?.[dataKey];
                    return value !== undefined
                        ? { key: dataKey, value, color: (child as React.ReactElement).props.fill }
                        : null;
                }
                return null;
            })
            .filter((val) => val !== null);

        if (values.length > 0) {
            setTooltipData({ name: entry.name, values });
            const svgRect = svgRef.current?.getBoundingClientRect();
            if (svgRect) {
                setPosition({ x: event.clientX - svgRect.left, y: event.clientY - svgRect.top });
            }
        }
    };

    const handleMouseOut = () => {
        setTooltipData(null);
    };

    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    const totalGroups = data.length;
    const totalBars = Object.keys(groupedBarComponents).length;
    const barZoneSize =
        layout === 'horizontal'
            ? (width - (margin.left ?? DEFAULT_MARGIN) - rightMargin - leftMargin) / totalGroups
            : (height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)) / totalGroups;

    const adjustedCategoryGap = parseGap(barCategoryGap, barZoneSize);
    const barSize = (barZoneSize - adjustedCategoryGap) / totalBars;
    const adjustedBarGap = parseGap(barGap, barSize * totalBars);

    const stackIdPositions: { [key: string]: number } = {};
    let currentStackIdPos = 0;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const renderBars = (stackComponents: React.ReactElement[], entry: any) => {
        let accumulatedHeight = 0;

        return stackComponents.map((child, barIndex) => {
            const stackId = child.props.stackId;
            const stackIdPos = stackIdPositions[stackId] ?? currentStackIdPos;
            if (!(stackId in stackIdPositions)) {
                stackIdPositions[stackId] = currentStackIdPos;
                currentStackIdPos++;
            }

            const barProps = {
                data: [entry],
                width:
                    layout === 'horizontal'
                        ? barSize - adjustedBarGap
                        : width - (margin.left ?? DEFAULT_MARGIN) - rightMargin,
                height:
                    layout === 'horizontal'
                        ? height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)
                        : barSize - adjustedBarGap,
                maxValue,
                minValue,
                barIndex,
                totalBars,
                barGap: adjustedBarGap,
                layout,
                accumulatedHeight,
                stackIdPos,
                onMouseOver: (event: React.MouseEvent) => handleMouseOver(event, { name: entry.name }),
                onMouseOut: handleMouseOut,
            };

            const renderedBar = React.cloneElement(child, barProps);

            if (layout === 'horizontal') {
                accumulatedHeight += (entry[child.props.dataKey] / maxValue) * barProps.height;
            } else {
                accumulatedHeight += (entry[child.props.dataKey] / maxValue) * barProps.width;
            }

            return renderedBar;
        });
    };

    return (
        <div className='bg-white'>
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
                ref={svgRef}
                width={width}
                height={height + height * 0.1}
                className='overflow-visible'
                onMouseLeave={handleMouseLeave}
            >
                <g
                    transform={`translate(${(margin.left ?? DEFAULT_MARGIN) + leftMargin}, ${
                        (margin.top ?? DEFAULT_MARGIN) + height * 0.025
                    })`}
                >
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
                    {layout === 'horizontal' && (
                        <>
                            {yAxisComponent && (
                                <YAxisV2
                                    height={height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)}
                                    maxValue={maxValue}
                                    minValue={minValue}
                                    layout={layout}
                                />
                            )}
                            {cartesianGridComponent && (
                                <CartesianGridV2
                                    width={width - (margin.left ?? DEFAULT_MARGIN) - rightMargin - leftMargin}
                                    height={height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)}
                                    minValue={minValue}
                                    layout={layout}
                                />
                            )}
                            {xAxisComponent && (
                                <XAxisV2
                                    data={data}
                                    width={width - (margin.left ?? DEFAULT_MARGIN) - rightMargin - leftMargin}
                                    height={height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)}
                                    dataKey='name'
                                    maxValue={maxValue}
                                    minValue={minValue}
                                    layout={layout}
                                />
                            )}
                        </>
                    )}
                    {layout === 'vertical' && (
                        <>
                            {xAxisComponent && (
                                <XAxisV2
                                    data={data}
                                    width={width - (margin.left ?? DEFAULT_MARGIN) - rightMargin}
                                    height={height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)}
                                    dataKey='name'
                                    maxValue={maxValue}
                                    minValue={minValue}
                                    layout={layout}
                                />
                            )}
                            {cartesianGridComponent && (
                                <CartesianGridV2
                                    width={width - (margin.left ?? DEFAULT_MARGIN) - rightMargin}
                                    height={height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)}
                                    minValue={minValue}
                                    layout={layout}
                                />
                            )}
                            {yAxisComponent && (
                                <YAxisV2
                                    data={data}
                                    width={width - (margin.left ?? DEFAULT_MARGIN) - rightMargin}
                                    height={height - (margin.top ?? DEFAULT_MARGIN) - (margin.bottom ?? DEFAULT_MARGIN)}
                                    maxValue={maxValue}
                                    minValue={minValue}
                                    layout={layout}
                                />
                            )}
                        </>
                    )}
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    {data.map((entry: any, index: number) => (
                        <g
                            key={uuidv4()}
                            transform={
                                layout === 'horizontal'
                                    ? `translate(${index * barZoneSize + adjustedCategoryGap / 2}, 0)`
                                    : `translate(0, ${index * barZoneSize + adjustedCategoryGap / 2})`
                            }
                        >
                            {Object.values(groupedBarComponents).map((stackComponents) =>
                                renderBars(stackComponents, entry),
                            )}
                        </g>
                    ))}
                </g>
            </svg>
            {legendComponent && (
                <div className='mt-4'>
                    <LegendV2 items={legendItems} />
                </div>
            )}
            {tooltipComponent && <TooltipV2 tooltipData={tooltipData} position={position} />}
        </div>
    );
};

export default BarChartV2;