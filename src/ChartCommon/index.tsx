import React from 'react';
import { Legend, ReferenceLine, Tooltip } from 'recharts';
import { getValueFormatted } from '../utils';
import ChartTooltip from '@tremor/react/dist/components/chart-elements/common/ChartTooltip';
import { LegendFormatType } from '../constants';
import { Color } from '@tremor/react';
import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';

export type ChartDecoratorsSettings = {
    legendFormatType?: LegendFormatType;
    refLineY?: { value: number; label: string; color: string };
    categoryColors: Map<string, Color>;
    legend?: boolean;
    legendHeight?: number;
    setLegendHeight?: React.Dispatch<React.SetStateAction<number>>;
};

export const ChartDecorators = ({
    refLineY,
    legendFormatType,
    categoryColors,
    legend,
    legendHeight,
    setLegendHeight = () => {},
}: ChartDecoratorsSettings) => [
    refLineY ? (
        <ReferenceLine
            key='refLineY'
            y={refLineY.value}
            label={{
                position: 'insideTopRight',
                value: refLineY.label,
                fontSize: 11,
                offset: 7,
            }}
            stroke={refLineY.color}
        />
    ) : null,
    <Tooltip
        key='tooltip'
        wrapperStyle={{ outline: 'none' }}
        isAnimationActive={false}
        cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
        content={({ active, payload, label }) => (
            <ChartTooltip
                active={active}
                payload={payload}
                label={label as string}
                valueFormatter={(value: number) => getValueFormatted(value, legendFormatType)}
                categoryColors={categoryColors}
            />
        )}
    />,
    legend ? (
        <Legend
            key='legend'
            iconType='circle'
            height={legendHeight}
            content={({ payload }) => ChartLegend({ payload }, categoryColors, setLegendHeight, undefined, undefined)}
        />
    ) : null,
];
