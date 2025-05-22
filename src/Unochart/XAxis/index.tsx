import type React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateAxisConfig, formatValue } from '../../utils';

interface XAxisProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data?: Array<{ [key: string]: any }>;
    width?: number;
    height?: number;
    dataKey?: string;
    maxValue?: number;
    minValue?: number;
    layout?: 'horizontal' | 'vertical';
    type?: 'monotone' | 'number';
}

const XAxis: React.FC<XAxisProps> = ({
    data = [],
    width = 0,
    height = 0,
    dataKey = 'name',
    maxValue = 0,
    minValue = 0,
    layout = 'horizontal',
    type = 'monotone',
}) => {
    const { positiveLines, negativeLines, totalLines, positiveRange, negativeRange } = calculateAxisConfig(
        maxValue,
        minValue,
    );

    const renderText = (x: number, y: number, value: string | number) => (
        <g key={uuidv4()}>
            <line x1={x} y1={height} x2={x} y2={height + 6} stroke='currentColor' strokeWidth={1} />
            <text x={x} y={height + 20} textAnchor='middle' fill='currentColor' fontSize={12}>
                {value}
            </text>
        </g>
    );

    const axisLine = <line x1={0} y1={height} x2={width} y2={height} stroke='currentColor' strokeWidth={1} />;

    if (type === 'number') {
        return (
            <g>
                {axisLine}
                {minValue < 0 &&
                    new Array(negativeLines).fill(null).map((_, index) => {
                        const value = -negativeRange * (negativeLines - index);
                        return renderText((index * width) / totalLines, height, formatValue(value));
                    })}

                {new Array(positiveLines + 1).fill(null).map((_, index) => {
                    const value = positiveRange * index;
                    return renderText(((index + negativeLines) * width) / totalLines, height, formatValue(value));
                })}
            </g>
        );
    }

    return (
        <g>
            {axisLine}
            {layout === 'horizontal' ? (
                data.map((entry, index) => renderText((index + 0.5) * (width / data.length), height, entry[dataKey]))
            ) : (
                <>
                    {minValue < 0 &&
                        new Array(negativeLines).fill(null).map((_, index) => {
                            const value = -negativeRange * (negativeLines - index);
                            return renderText((index * width) / totalLines, height, formatValue(value));
                        })}

                    {new Array(positiveLines + 1).fill(null).map((_, index) => {
                        const value = positiveRange * index;
                        return renderText(((index + negativeLines) * width) / totalLines, height, formatValue(value));
                    })}
                </>
            )}
        </g>
    );
};

export default XAxis;
