import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer } from 'recharts';
import { Color, Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import objectHash from 'object-hash';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { colorPalette } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';
import { renderLegendText } from '../utils';

const defaultShimmerColors = new Map<string, Color>();
defaultShimmerColors.set('Loading', 'gray');

const generateFakeData = () =>
    [...Array(6)].map((_, i) => ({
        name: `Loading ${i + 1}`,
        Loading: Math.floor(Math.random() * 100),
    }));

export const ChartBarShimmer = ({ className }: any) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>(generateFakeData());

    useEffect(() => {
        const interval = setInterval(() => setDataStore(generateFakeData()), 700);

        return () => clearInterval(interval);
    }, []);

    return (
        <Flex className={twMerge('w-full h-60 loading-shimmer rounded p-2', className)}>
            <ResponsiveContainer>
                <BarChart data={dataStore}>
                    <Legend
                        iconType='circle'
                        formatter={renderLegendText}
                        height={legendHeight}
                        content={({ payload }) => ChartLegend({ payload }, defaultShimmerColors, setLegendHeight)}
                    />
                    <Bar
                        dataKey='Loading'
                        fill=''
                        className={getColorClassNames('gray', colorPalette.background).fillColor}
                    >
                        {dataStore.map((item) => (
                            <Cell key={objectHash(item)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Flex>
    );
};

export const ChartLineShimmer = ({ className }: any) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>(generateFakeData());

    useEffect(() => {
        const interval = setInterval(() => setDataStore(generateFakeData()), 700);

        return () => clearInterval(interval);
    }, []);

    return (
        <Flex className={twMerge('w-full h-60 loading-shimmer rounded p-2', className)}>
            <ResponsiveContainer>
                <LineChart data={dataStore}>
                    <CartesianGrid strokeDasharray='2 2' />
                    <Legend
                        iconType='circle'
                        formatter={renderLegendText}
                        height={legendHeight}
                        content={({ payload }) => ChartLegend({ payload }, defaultShimmerColors, setLegendHeight)}
                    />
                    <Line
                        className={getColorClassNames('gray', colorPalette.text).strokeColor}
                        activeDot={{
                            className: tremorTwMerge(
                                'stroke-tremor-background dark:stroke-dark-tremor-background',
                                getColorClassNames('gray', colorPalette.text).fillColor,
                            ),
                        }}
                        type='monotone'
                        name='Loading'
                        dataKey='Loading'
                        dot={false}
                        stroke=''
                        strokeWidth={2}
                        strokeLinejoin='round'
                        strokeLinecap='round'
                    />
                </LineChart>
            </ResponsiveContainer>
        </Flex>
    );
};