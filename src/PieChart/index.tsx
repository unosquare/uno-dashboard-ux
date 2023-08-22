import objectHash from 'object-hash';
import React from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { UnoChartTooltip } from '../ChartLegend';
import { ChartComponent, ChartData } from '../constants';
import { NoData } from '../NoData';

export const PieChart = ({
    rawData,
    dataCallback,
    legendFormatType,
    colors = themeColorRange,
}: ChartComponent<any, ChartData[]>) => {
    const dataStore: ChartData[] = (dataCallback && rawData && dataCallback(rawData)) || [];
    const categoryColors = constructCategoryColors(
        dataStore.map((x) => x.name),
        colors,
    );

    return dataStore.length > 0 ? (
        <div className='h-60'>
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
                            <UnoChartTooltip
                                categoryColors={categoryColors}
                                legendFormatType={legendFormatType}
                                type='pie'
                            />
                        }
                    />
                </PieChartRechart>
            </ResponsiveContainer>
        </div>
    ) : (
        <NoData />
    );
};
