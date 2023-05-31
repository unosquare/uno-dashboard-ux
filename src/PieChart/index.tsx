import objectHash from 'object-hash';
import React from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartLegend } from '../ChartLegend';
import { ChartComponent, ChartData, ChartTypes } from '../constants';
import { NoData } from '../NoData';
import { defaultChartPalette } from '../theme';

export const PieChart = ({
    rawData,
    dataCallback,
    legendFormatType,
    colors = defaultChartPalette,
}: ChartComponent<any, ChartData[]>) => {
    const dataStore: ChartData[] = (dataCallback && rawData && dataCallback(rawData)) || [];

    return dataStore.length > 0 ? (
        <div className='h-60'>
            <ResponsiveContainer>
                <PieChartRechart>
                    <Pie data={dataStore} dataKey='value' fill='#f1f2f3' startAngle={90} endAngle={-360}>
                        {dataStore.map((data, index) => (
                            <Cell key={objectHash(data)} fill={colors[index]} />
                        ))}
                    </Pie>
                    <Tooltip content={<ChartLegend legendFormatType={legendFormatType} type={ChartTypes.PIE} />} />
                </PieChartRechart>
            </ResponsiveContainer>
        </div>
    ) : (
        <NoData />
    );
};
