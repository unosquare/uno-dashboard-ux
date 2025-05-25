import type React from 'react';

interface ReferenceLineProps {
    x?: string | number;
    y?: number;
    stroke?: string;
    label?: string;
    chartWidth?: number;
    chartHeight?: number;
    xScale?: (value: string | number) => number;
    yScale?: (value: number) => number;
}

const ReferenceLine: React.FC<ReferenceLineProps> = ({
    x,
    y,
    stroke = '#ef4444',
    label,
    chartWidth = 0,
    chartHeight = 0,
    xScale = (value) => 0,
    yScale = (value) => 0,
}) => {
    const xPosition = x !== undefined ? xScale(x) : 0;
    const yPosition = y !== undefined ? yScale(y) : 0;

    return (
        <g className='recharts-reference-line'>
            {x !== undefined && (
                <line
                    x1={xPosition}
                    y1={0}
                    x2={xPosition}
                    y2={chartHeight}
                    stroke={stroke}
                    strokeWidth={2}
                    className='transition-all duration-300 ease-in-out'
                />
            )}
            {y !== undefined && (
                <line
                    x1={0}
                    y1={yPosition}
                    x2={chartWidth}
                    y2={yPosition}
                    stroke={stroke}
                    strokeWidth={2}
                    className='transition-all duration-300 ease-in-out'
                />
            )}
            {label && (
                <text
                    x={x !== undefined ? xPosition : chartWidth}
                    y={y !== undefined ? yPosition : 0}
                    dy={y !== undefined ? -5 : 15}
                    dx={x !== undefined ? 5 : -5}
                    textAnchor={x !== undefined ? 'start' : 'end'}
                    fill={stroke}
                    className='text-xs font-semibold transition-all duration-300 ease-in-out'
                >
                    {label}
                </text>
            )}
        </g>
    );
};

export default ReferenceLine;
