import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer } from 'recharts';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { ChartLegend } from '../ChartLegend';
import { Flex } from '../Flex';
import type { ClassNameComponent, Color } from '../constants';
import { colorPalette, getColorClassNames } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const defaultShimmerColors = new Map<string, Color>();
defaultShimmerColors.set('Loading', 'gray');

const generateFakeData = () =>
    Array.from(
        {
            length: 6,
        },
        (_, i) => ({
            name: `Loading ${i + 1}`,
            Loading: Math.floor(Math.random() * 100),
        }),
    );

export const ChartBarShimmer = ({ className }: ClassNameComponent) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>(generateFakeData());

    useEffect(() => {
        const interval = setInterval(() => setDataStore(generateFakeData()), 700);

        return () => clearInterval(interval);
    }, []);

    return (
        <Flex className={twMerge('w-full h-60 loading-shimmer rounded-sm p-2', className)}>
            <ResponsiveContainer>
                <BarChart data={dataStore}>
                    <Legend
                        iconType='circle'
                        height={legendHeight}
                        content={({ payload }) =>
                            ChartLegend({ payload }, defaultShimmerColors, setLegendHeight, undefined, undefined)
                        }
                    />
                    <Bar
                        dataKey='Loading'
                        fill=''
                        className={getColorClassNames('gray', colorPalette.background).fillColor}
                    >
                        {dataStore.map(() => (
                            <Cell key={uuidv4()} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Flex>
    );
};

export const ChartLineShimmer = ({ className }: ClassNameComponent) => {
    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>(generateFakeData());

    useEffect(() => {
        const interval = setInterval(() => setDataStore(generateFakeData()), 700);

        return () => clearInterval(interval);
    }, []);

    return (
        <Flex className={twMerge('w-full h-60 loading-shimmer rounded-sm p-2', className)}>
            <ResponsiveContainer>
                <LineChart data={dataStore}>
                    <CartesianGrid strokeDasharray='2 2' />
                    <Legend
                        iconType='circle'
                        height={legendHeight}
                        content={({ payload }) =>
                            ChartLegend({ payload }, defaultShimmerColors, setLegendHeight, undefined, undefined)
                        }
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
