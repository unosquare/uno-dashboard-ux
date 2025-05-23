import type React from 'react';

export interface BarPointClickEvent<T> {
    event: React.MouseEvent<SVGRectElement>;
    dataKey: keyof T;
    index?: number;
    value: number;
    name: string;
    entry: T;
}

interface BarProps {
    data?: Array<{ name: string; [key: string]: any }>;
    dataKey: string;
    fill: string;
    width?: number;
    height?: number;
    maxValue?: number;
    minValue?: number;
    layout?: 'horizontal' | 'vertical';
    barIndex?: number;
    totalBars?: number;
    barGap?: number;
    stackId?: string;
    accumulatedHeight?: number;
    stackIdPos?: number;
    onMouseOver?: (event: React.MouseEvent, entry: { name: string; [key: string]: any }) => void;
    onMouseOut?: () => void;
    onClick?: (event: BarPointClickEvent<{ name: string; [key: string]: any }>) => void;
}

const Bar: React.FC<BarProps> = ({
    data = [],
    dataKey,
    fill,
    width = 0,
    height = 0,
    maxValue = 0,
    minValue = 0,
    layout = 'horizontal',
    barIndex = 0,
    totalBars = 1,
    barGap = 0,
    stackId,
    accumulatedHeight = 0,
    stackIdPos = 0,
    onMouseOver = () => {},
    onMouseOut = () => {},
    onClick = () => {},
}) => (
    <g>
        {data.map((entry) => {
            const value = entry[dataKey];

            if (Array.isArray(value)) {
                const [minValueRange, maxValueRange] = value;

                if (layout === 'horizontal') {
                    const barHeight = ((maxValueRange - minValueRange) / (maxValue - minValue)) * height;
                    return (
                        <rect
                            key={`${entry.name}-${dataKey}`}
                            x={stackIdPos * (width + barGap)}
                            y={
                                height -
                                ((maxValueRange - minValue) / (maxValue - minValue)) * height -
                                accumulatedHeight
                            }
                            width={width}
                            height={barHeight}
                            fill={fill}
                            className='transition-all duration-300 ease-in-out hover:opacity-80 hover:shadow-lg'
                            style={{ transformOrigin: 'bottom' }}
                            onMouseOver={(event) => {
                                const { name, ...rest } = entry;
                                onMouseOver(event, { name, ...rest });
                            }}
                            onMouseOut={onMouseOut}
                            onClick={(event) => onClick({
                                dataKey, value: Number(value), name: entry.name, entry,
                                event: event, index: Number(stackId)
                            })}
                        />
                    );
                } else {
                    const barWidth = ((maxValueRange - minValueRange) / (maxValue - minValue)) * width;
                    return (
                        <rect
                            key={`${entry.name}-${dataKey}`}
                            x={((minValueRange - minValue) / (maxValue - minValue)) * width + accumulatedHeight}
                            y={stackIdPos * (height + barGap)}
                            width={barWidth}
                            height={height}
                            fill={fill}
                            className='transition-all duration-300 ease-in-out hover:opacity-80 hover:shadow-lg'
                            style={{ transformOrigin: 'left' }}
                            onMouseOver={(event) => {
                                const { name, ...rest } = entry;
                                onMouseOver(event, { name, ...rest });
                            }}
                            onMouseOut={onMouseOut}
                            onClick={(event) => onClick({
                                dataKey, value: Number(value), name: entry.name, entry,
                                event: event, index: Number(stackId)
                            })}
                        />
                    );
                }
            }

            const barHeight = (value / maxValue) * height;
            const barWidth = (value / maxValue) * width;
            return layout === 'horizontal' ? (
                <rect
                    key={`${entry.name}-${dataKey}`}
                    x={stackIdPos * (width + barGap)}
                    y={height - barHeight - accumulatedHeight}
                    width={width}
                    height={barHeight}
                    fill={fill}
                    className='transition-all duration-300 ease-in-out hover:opacity-80 hover:shadow-lg'
                    style={{ transformOrigin: 'bottom' }}
                    onMouseOver={(event) => {
                        const { name, ...rest } = entry;
                        onMouseOver(event, { name, ...rest });
                    }}
                    onMouseOut={onMouseOut}
                    onClick={(event) => onClick({
                        dataKey, value: Number(value), name: entry.name, entry,
                        event: event, index: Number(stackId)
                    })}
                />
            ) : (
                <rect
                    key={`${entry.name}-${dataKey}`}
                    x={accumulatedHeight}
                    y={stackIdPos * (height + barGap)}
                    width={barWidth}
                    height={height}
                    fill={fill}
                    className='transition-all duration-300 ease-in-out hover:opacity-80 hover:shadow-lg'
                    style={{ transformOrigin: 'left' }}
                    onMouseOver={(event) => {
                        const { name, ...rest } = entry;
                        onMouseOver(event, { name, ...rest });
                    }}
                    onMouseOut={onMouseOut}
                    onClick={(event) => onClick({
                        dataKey, value: Number(value), name: entry.name, entry,
                        event: event, index: Number(stackId)
                    })}
                />
            );
        })}
    </g>
);

export default Bar;
