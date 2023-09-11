import objectHash from 'object-hash';
import React from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { twMerge } from 'tailwind-merge';
import { UnoChartTooltip } from '../ChartLegend';
import { ChartComponent, ChartData } from '../constants';
import { NoData } from '../NoData';

export const PieChart = <T,>({
    rawData,
    dataCallback,
    legendFormatType,
    className,
    colors = themeColorRange,
}: ChartComponent<T, ChartData[]>) => {
    const dataStore: ChartData[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const categoryColors = constructCategoryColors(
        dataStore.map((x) => x.name),
        colors,
    );

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
