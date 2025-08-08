import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import { twMerge } from 'tailwind-merge';
import { ChartTooltip } from '../ChartTooltip';
import type { ChartComponent, ChartData } from '../constants';
import { Flex } from '../Flex';
import { NoData } from '../NoData';
import { BaseColors, colorPalette, constructCategoryColors, getColorClassNames, themeColorRange } from '../theme';
import { getValueFormatted } from '../utils';

export type PieChartProps<T> = ChartComponent<T, ChartData[]> & {
    serieName?: string;
    onSegmentClick?: (data: ChartData) => void;
};

export const PieChart = <T,>({
    rawData,
    dataCallback,
    legendFormatType,
    className,
    serieName = 'Data',
    onSegmentClick,
}: PieChartProps<T>) => {
    const dataTransformFn = dataCallback ?? ((data: T) => data as unknown as ChartData[]);
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
                                onClick={onSegmentClick ? () => onSegmentClick(data) : undefined}
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
                                payload={payload as any[]}
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
