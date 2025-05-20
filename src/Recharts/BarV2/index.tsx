import type React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface BarProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onMouseOver?: (event: React.MouseEvent, entry: { name: string; [key: string]: any }) => void;
    onMouseOut?: () => void;
}

const BarV2: React.FC<BarProps> = ({
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
}) => (
    <g>
        {data.map((entry) => {
            const value = entry[dataKey];

            if (Array.isArray(value)) {
                const [minValueRange, maxValueRange] = value;

                if (layout === 'horizontal') {
                    const barHeight = ((maxValueRange - minValueRange) / (maxValue - minValue)) * height;
                    return (
                        // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
                        <rect
                            key={uuidv4()}
                            x={stackIdPos * (width + barGap)}
                            y={
                                height -
                                ((maxValueRange - minValue) / (maxValue - minValue)) * height -
                                accumulatedHeight
                            }
                            width={width}
                            height={barHeight}
                            fill={fill}
                            className='transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 hover:shadow-lg'
                            style={{ transformOrigin: 'bottom' }}
                            onMouseOver={(event) => {
                                const { name, ...rest } = entry;
                                onMouseOver(event, { name, ...rest });
                            }}
                            onMouseOut={onMouseOut}
                        />
                    );
                // biome-ignore lint/style/noUselessElse: <explanation>
                } else {
                    const barWidth = ((maxValueRange - minValueRange) / (maxValue - minValue)) * width;
                    return (
                        // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
                        <rect
                            key={uuidv4()}
                            x={((minValueRange - minValue) / (maxValue - minValue)) * width + accumulatedHeight}
                            y={stackIdPos * (height + barGap)}
                            width={barWidth}
                            height={height}
                            fill={fill}
                            className='transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 hover:shadow-lg'
                            style={{ transformOrigin: 'left' }}
                            onMouseOver={(event) => {
                                const { name, ...rest } = entry;
                                onMouseOver(event, { name, ...rest });
                            }}
                            onMouseOut={onMouseOut}
                        />
                    );
                }
            }

            const barHeight = (value / maxValue) * height;
            const barWidth = (value / maxValue) * width;

            return layout === 'horizontal' ? (
                // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
                <rect
                    key={uuidv4()}
                    x={stackIdPos * (width + barGap)}
                    y={height - barHeight - accumulatedHeight}
                    width={width}
                    height={barHeight}
                    fill={fill}
                    className='transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 hover:shadow-lg'
                    style={{ transformOrigin: 'bottom' }}
                    onMouseOver={(event) => {
                        const { name, ...rest } = entry;
                        onMouseOver(event, { name, ...rest });
                    }}
                    onMouseOut={onMouseOut}
                />
            ) : (
                // biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation>
                <rect
                    key={uuidv4()}
                    x={accumulatedHeight}
                    y={stackIdPos * (height + barGap)}
                    width={barWidth}
                    height={height}
                    fill={fill}
                    className='transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 hover:shadow-lg'
                    style={{ transformOrigin: 'left' }}
                    onMouseOver={(event) => {
                        const { name, ...rest } = entry;
                        onMouseOver(event, { name, ...rest });
                    }}
                    onMouseOut={onMouseOut}
                />
            );
        })}
    </g>
);

export default BarV2;