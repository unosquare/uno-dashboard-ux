import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';
import ChartTooltip from '@tremor/react/dist/components/chart-elements/common/ChartTooltip';
import type React from 'react';
import { Legend, ReferenceLine, Tooltip } from 'recharts';
import type { LegendFormatType } from '../constants';
import { getValueFormatted } from '../utils';

export type ChartDecoratorsSettings = {
    keys: string[];
    legendFormatType?: LegendFormatType;
    refLineY?: { value: number; label: string; color: string };
    categoryColors: Map<string, string>;
    legend?: boolean;
    legendHeight?: number;
    setLegendHeight?: React.Dispatch<React.SetStateAction<number>>;
};

const colors = ['blue', 'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber'];

const getMap = (keys: string[]) => {
    const map = new Map<string, string>();
    keys.forEach((key, index) => {
        map.set(key, colors[index]);
    });
    return map;
};

export const ChartDecorators = ({
    keys,
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
            content={({ payload }) =>
                ChartLegend(
                    { payload },
                    categoryColors.size === 0 ? getMap(keys) : categoryColors,
                    setLegendHeight,
                    undefined,
                    undefined,
                )
            }
        />
    ) : null,
];
