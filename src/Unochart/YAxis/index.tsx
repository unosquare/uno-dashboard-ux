import type React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateAxisConfig, formatValue } from '../../utils';

interface YAxisProps {
    data?: Array<{ [key: string]: any }>;
    height?: number;
    maxValue?: number;
    minValue?: number;
    width?: number;
    layout?: 'horizontal' | 'vertical';
    type?: 'monotone' | 'number';
    dataKey?: string;
    /**
     * Si true y type="number", se ignora calculateAxisConfig
     * y se generan ticks uniformes redondeados a entero.
     */
    enableSimpleTicks?: boolean;
}

const YAxis: React.FC<YAxisProps> = ({
    data = [],
    height = 0,
    width = 0,
    maxValue = 0,
    minValue = 0,
    layout = 'horizontal',
    type = 'monotone',
    dataKey = 'name',
    enableSimpleTicks = false,
}) => {
    const axisLine = <line x1={0} y1={0} x2={0} y2={height} stroke='currentColor' strokeWidth={1} />;

    const renderText = (x: number, y: number, value: string | number) => (
        <g key={uuidv4()}>
            <line x1={0} y1={y} x2={-6} y2={y} stroke='currentColor' strokeWidth={1} />
            <text x={x} y={y} textAnchor='end' dominantBaseline='middle' fill='currentColor' fontSize={12}>
                {value}
            </text>
        </g>
    );

    // Nueva lógica: si type="number" y enableSimpleTicks, generamos 5 ticks y los redondeamos
    if (type === 'number' && enableSimpleTicks) {
        const TICK_COUNT = 5;
        const range = maxValue - minValue || 1;
        const step = range / TICK_COUNT;
        const ticks = [];
        for (let i = 0; i <= TICK_COUNT; i++) {
            ticks.push(minValue + i * step);
        }

        return (
            <g>
                {axisLine}
                {ticks.map((tickValue) => {
                    const y = height - ((tickValue - minValue) / range) * height;
                    const displayValue = Math.round(tickValue); // <- Redondeo a entero
                    return renderText(-10, y, displayValue);
                })}
            </g>
        );
    }

    // Lógica original para type="number"
    if (type === 'number') {
        const { positiveLines, negativeLines, totalLines, positiveRange, negativeRange } = calculateAxisConfig(
            maxValue,
            minValue,
        );

        return (
            <g>
                {axisLine}
                {minValue < 0 &&
                    new Array(negativeLines).fill(null).map((_, index) => {
                        const value = -negativeRange * (negativeLines - index);
                        return renderText(-10, height - (index * height) / totalLines, formatValue(value));
                    })}

                {new Array(positiveLines + 1).fill(null).map((_, index) => {
                    const value = positiveRange * index;
                    return renderText(
                        -10,
                        height - ((index + negativeLines) * height) / totalLines,
                        formatValue(value),
                    );
                })}
            </g>
        );
    }

    // Lógica original type="monotone"
    const { positiveLines, negativeLines, totalLines } = calculateAxisConfig(maxValue, minValue);

    return (
        <g>
            {axisLine}
            {layout === 'horizontal' &&
                minValue < 0 &&
                new Array(negativeLines).fill(null).map((_, index) => {
                    const value = -(maxValue / negativeLines) * (negativeLines - index);
                    return renderText(-10, height - (index * height) / totalLines, formatValue(value));
                })}

            {layout === 'horizontal' &&
                new Array(positiveLines + 1).fill(null).map((_, index) => {
                    const value = (maxValue / positiveLines) * index;
                    return renderText(
                        -10,
                        height - ((index + negativeLines) * height) / totalLines,
                        formatValue(value),
                    );
                })}

            {layout !== 'horizontal' &&
                data.map((entry, index) => renderText(-10, (index + 0.5) * (height / data.length), entry[dataKey]))}
        </g>
    );
};

export default YAxis;
