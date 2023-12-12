import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Brush, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Color, Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import objectHash from 'object-hash';
import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { BaseColors } from '@tremor/react/dist/lib/constants';
import { ChartComponent, LegendFormatType } from '../constants';
import { NoData } from '../NoData';
import { formatTicks } from '../utils';
import { ChartBarShimmer } from '../ChartShimmers';
import { ChartDecorators } from '../ChartCommon';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';

type XAxisPrimaryFormatter = {
    (input: string): string;
};

export type ChartBarSettings<TDataIn> = ChartComponent<TDataIn, Record<string, unknown>[]> & {
    legendFormatType?: LegendFormatType;
    legend?: boolean;
    domain?: number;
    unit?: string;
    barSize?: number;
    xAxis?: boolean;
    multiXAxis?: {
        primary: XAxisPrimaryFormatter;
        secondary: (props: React.ComponentPropsWithRef<'svg'>) => ReactElement<SVGElement>;
    };
    stacked?: boolean;
    onClick?: (activeLabel: string, activeTooltipIndex: number) => void;
    scroll?: boolean;
    refLineY?: { value: number; label: string; color: string };
};

export const ChartBar = <T,>({
    rawData,
    dataCallback,
    colors,
    legend,
    domain,
    unit = '',
    barSize = 50,
    xAxis = true,
    multiXAxis,
    stacked,
    onClick,
    legendFormatType,
    scroll = false,
    refLineY,
    className,
}: ChartBarSettings<T>) => {
    const dataTransformFn = useMemo(
        () => dataCallback ?? ((data: T) => data as unknown as Record<string, unknown>[]),
        [dataCallback],
    );

    const [legendHeight, setLegendHeight] = useState(60);
    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>([]);
    const [categoryColors, setCategoryColors] = useState<Map<string, Color>>(new Map());
    const [keys, setKeys] = useState<string[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tickFormatter = (t: any) => (legendFormatType ? formatTicks(Number(t), legendFormatType) : t) as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onClickEvent = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (event?.activeLabel && onClick) onClick(String(event.activeLabel), Number(event.activeTooltipIndex));
    };

    useEffect(() => {
        setKeys(dataStore.length > 0 ? Object.keys(dataStore[0]).filter((property) => property !== 'name') : []);
    }, [dataStore]);

    useEffect(() => {
        setCategoryColors(constructCategoryColors(keys, colors ?? themeColorRange));
    }, [keys, colors]);

    useEffect(() => {
        if (rawData) setDataStore(dataTransformFn(rawData));
    }, [rawData, dataTransformFn]);

    if (!rawData) return <ChartBarShimmer className={className} />;

    return (
        <Flex className={twMerge('w-full h-60', className)}>
            {dataStore.length > 0 ? (
                <ResponsiveContainer>
                    <BarChart data={dataStore} maxBarSize={barSize} onClick={onClickEvent}>
                        {xAxis && <XAxis dataKey='name' tickFormatter={multiXAxis?.primary} />}
                        {xAxis && multiXAxis && (
                            <XAxis
                                dataKey='name'
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                height={1}
                                scale='auto'
                                xAxisId='secondary'
                                tick={multiXAxis.secondary}
                            />
                        )}
                        <YAxis
                            tickFormatter={tickFormatter}
                            type='number'
                            domain={[0, domain ?? 'auto']}
                            unit={unit}
                            allowDecimals={false}
                            width={70}
                            className={tremorTwMerge(
                                // common
                                'text-tremor-label',
                                // light
                                'fill-tremor-content',
                                // dark
                                'dark:fill-dark-tremor-content',
                            )}
                        />
                        {ChartDecorators({
                            refLineY,
                            legendFormatType,
                            categoryColors,
                            legend,
                            legendHeight,
                            setLegendHeight,
                        })}
                        {keys.map((property) =>
                            stacked ? (
                                <Bar
                                    dataKey={property}
                                    className={
                                        getColorClassNames(
                                            categoryColors.get(property) ?? BaseColors.Gray,
                                            colorPalette.background,
                                        ).fillColor
                                    }
                                    fill=''
                                    key={property}
                                    stackId='a'
                                />
                            ) : (
                                <Bar
                                    dataKey={property}
                                    fill=''
                                    className={
                                        getColorClassNames(
                                            categoryColors.get(property) ?? BaseColors.Gray,
                                            colorPalette.background,
                                        ).fillColor
                                    }
                                    key={property}
                                >
                                    {dataStore.map((item) => (
                                        <Cell key={objectHash(item)} />
                                    ))}
                                </Bar>
                            ),
                        )}
                        {scroll && (
                            <Brush dataKey='name' height={15} stroke='#f1f2f3' endIndex={11} travellerWidth={10} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
