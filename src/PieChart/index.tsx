import ChartTooltip from '@tremor/react/dist/components/chart-elements/common/ChartTooltip';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { themeColorRange } from '@tremor/react/dist/lib/theme';
import { useMemo } from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import { twMerge } from 'tailwind-merge';
import { NoData } from '../NoData';
import type { ChartComponent, ChartData } from '../constants';
import { getValueFormatted } from '../utils';
import { Flex } from '../Flex';
import { colorPalette, getColorClassNames } from '../theme';

export type PieChartProps<T> = ChartComponent<T, ChartData[]> & {
    serieName?: string;
};

export const PieChart = <T,>({
    rawData,
    dataCallback,
    legendFormatType,
    className,
    serieName = 'Data',
}: PieChartProps<T>) => {
    const dataTransformFn = useMemo(
        () => dataCallback ?? ((data: T) => data as unknown as ChartData[]),
        [dataCallback],
    );
    const dataStore: ChartData[] = (rawData && dataTransformFn(rawData)) || [];
    const categoryColors = constructCategoryColors(
        dataStore.map((x) => x.name),
        themeColorRange,
    );

    if (!rawData) {
        return (
            <Flex alignItems='center' justifyContent='center' className={twMerge('h-60', className)}>
                <div className='h-60 w-60 content-center loading-shimmer rounded-full'>&nbsp;</div>
            </Flex>
        );
    }

    if (dataStore.length === 0) return <NoData />;

    return (
        <div className={twMerge('h-60', className)}>
            <ResponsiveContainer>
                <PieChartRechart>
                    <Pie data={dataStore} dataKey='value' fill='#f1f2f3' startAngle={90} endAngle={-360}>
                        {dataStore.map((data) => (
                            <Cell
                                key={data.name}
                                fill=''
                                className={
                                    getColorClassNames(
                                        categoryColors.get(data.name) ?? BaseColors.Gray,
                                        colorPalette.background,
                                    ).fillColor
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        wrapperStyle={{ outline: 'none' }}
                        isAnimationActive={false}
                        cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                        content={({ active, payload }) => (
                            <ChartTooltip
                                active={active}
                                payload={payload}
                                label={serieName}
                                valueFormatter={(value: number) => getValueFormatted(value, legendFormatType)}
                                categoryColors={categoryColors}
                            />
                        )}
                    />
                </PieChartRechart>
            </ResponsiveContainer>
        </div>
    );
};
