import React from 'react';
import tw from 'tailwind-styled-components';
import { FormatTypes, humanize } from 'uno-js';
import objectHash from 'object-hash';
import { Color, Flex, Text } from '@tremor/react';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { colorPalette } from '@tremor/react/dist/lib/theme';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { sizing } from '@tremor/react/dist/lib/sizing';
import { border } from '@tremor/react/dist/lib/shape';
import { getValueFormatted } from '../utils';
import { HasChildrenComponent, LegendFormatType } from '../constants';

const TooltipTitle = ({ children }: HasChildrenComponent) => (
    <Flex alignItems='center' className='text-sm pl-1 pb-1 pt-1'>
        {children}
    </Flex>
);

export type ChartLegendSettings = {
    legendFormatType?: LegendFormatType;
    active?: boolean;
    payload?: any;
    customValue?: CustomOptions;
    customLabel?: CustomOptions;
    title?: boolean;
    ignoreValue?: boolean;
    formats?: FormatTypes[];
    accumulated?: boolean;
    categoryColors: Map<string, Color>;
};

export type CustomOptions = {
    prefix: boolean;
    values: string[];
};

const getCustomLabel = ({ values, prefix }: CustomOptions, index: number, { name }: any) =>
    prefix ? `${values[index]} ${name}` : `${name} ${values[index]}`;

const getCustomValue = ({ values, prefix }: CustomOptions, index: number, { value }: any) =>
    prefix ? `${values[index]} ${value}` : `${value} ${values[index]}`;

const getLabel =
    (customLabel: CustomOptions | undefined, customValue: CustomOptions | undefined, ignoreValue: boolean) =>
    (category: any, index: number, legendFormatType?: LegendFormatType) => {
        let { name, value } = category;

        if (ignoreValue && value === 0.001) value = 0;

        if (customLabel && customLabel.values.length > 0) name = getCustomLabel(customLabel, index, category);

        if (customValue && customValue.values.length > 0) value = getCustomValue(customValue, index, category);

        return [humanize(name), getValueFormatted(value, legendFormatType)];
    };

const StyledLegend = tw.div`
    max-w-xs 
    z-20
    p-2
    rounded-tremor-default
    text-white 
    border-tremor-border
    bg-tremor-background-subtle
    dark:text 
    dark:bg-dark-tremor-background-subtle
    dark:border-dark-tremor-border
`;

const getLegendFormatType = (formats: any[], index: number, legendFormatType: LegendFormatType) => {
    if (formats && formats[index] === 'percentage') return 'percentage';
    if (formats && formats[index] === 'money') return 'money';
    return legendFormatType;
};

const Component = ({ category, index, legendFormatType, formats, getLabelFunc, categoryColors }: any) => {
    const [label, value] = getLabelFunc(category, index, getLegendFormatType(formats, index, legendFormatType));

    return (
        <Flex className='gap-2'>
            <span
                className={tremorTwMerge(
                    // common
                    'shrink-0 rounded-tremor-full',
                    // light
                    'border-tremor-background shadow-tremor-card',
                    // dark
                    'dark:border-dark-tremor-background dark:shadow-dark-tremor-card',
                    getColorClassNames(categoryColors.get(category.name), colorPalette.background).bgColor,
                    sizing.sm.height,
                    sizing.sm.width,
                    border.md.all,
                )}
            />
            <Text>{label}</Text>
            <Text className='font-medium tabular-nums'>{value}</Text>
        </Flex>
    );
};

export const UnoChartTooltip = ({
    active,
    payload,
    customLabel,
    customValue,
    ignoreValue = false,
    formats,
    accumulated,
    legendFormatType,
    title = false,
    categoryColors,
}: ChartLegendSettings) => {
    const localPayload = payload || [];
    const legendTitle = localPayload.length > 0 ? localPayload[0].payload.name : '0';
    const getLabelFunc = getLabel(customLabel, customValue, ignoreValue);

    if (localPayload.some((c: any) => c.payload.name === 'IgnoreToolTip')) return payload[0].payload.label;

    return (
        <StyledLegend>
            {title && <TooltipTitle>{legendTitle}</TooltipTitle>}
            {active &&
                localPayload.length > 0 &&
                (accumulated
                    ? localPayload
                          .map((category: any, index: number) => {
                              localPayload[index].value = Object.values(category.payload)
                                  .filter((x: any) => x !== category.payload.name)
                                  .map((_: any, j: any, arr: any[]) =>
                                      arr
                                          .filter((__: any, k: any) => k <= j)
                                          .reduce((prev: any, curr: any) => prev + curr, 0),
                                  )[index];

                              const options = {
                                  category,
                                  index,
                                  legendFormatType,
                                  formats,
                                  getLabelFunc,
                                  categoryColors,
                              };
                              return <Component key={objectHash(options)} {...options} />;
                          })
                          .reverse()
                    : localPayload.map((category: any, index: number) => {
                          const options = {
                              category,
                              index,
                              legendFormatType,
                              formats,
                              getLabelFunc,
                              categoryColors,
                          };
                          return <Component key={objectHash(options)} {...options} />;
                      }))}
        </StyledLegend>
    );
};
