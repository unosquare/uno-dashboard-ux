import objectHash from 'object-hash';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { twMerge } from 'tailwind-merge';
import { UnoChartTooltip } from '../ChartLegend';
import { ChartComponent, ChartData } from '../constants';
import { NoData } from '../NoData';
import { Flex } from '@tremor/react';

export const PieChart = <T,>({
    rawData,
    dataCallback,
    legendFormatType,
    className,
}: ChartComponent<T, ChartData[]>) => {
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

    return dataStore.length > 0 ? (
        <div className={twMerge('h-60', className)}>
            <ResponsiveContainer>
                <PieChartRechart>
                    <Pie data={dataStore} dataKey='value' fill='#f1f2f3' startAngle={90} endAngle={-360}>
                        {dataStore.map((data) => (
                            <Cell
                                key={objectHash(data)}
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
                        content={
                            <UnoChartTooltip categoryColors={categoryColors} legendFormatType={legendFormatType} />
                        }
                    />
                </PieChartRechart>
            </ResponsiveContainer>
        </div>
    ) : (
        <NoData />
    );
};
