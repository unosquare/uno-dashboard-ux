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
import { LegendFormatType } from '../constants';

export type DefaultPayload = {
    value?: number | (string | number)[];
    name?: string;
    payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type ChartLegendSettings = {
    legendFormatType?: LegendFormatType;
    active?: boolean;
    payload?: Array<DefaultPayload>;
    customLabel?: CustomOptions;
    formats?: FormatTypes[];
    accumulated?: boolean;
    categoryColors: Map<string, Color>;
};

export type CustomOptions = {
    prefix: boolean;
    values: string[];
};

const getCustomLabel = ({ values, prefix }: CustomOptions, index: number, { name }: DefaultPayload) =>
    prefix ? `${values[index]} ${name}` : `${name} ${values[index]}`;

const getLabel =
    (customLabel: CustomOptions | undefined) =>
    (category: DefaultPayload, index: number, legendFormatType?: LegendFormatType) => {
        const { name, value } = category;
        let stringName = String(name);

        if (customLabel && customLabel.values.length > 0) stringName = getCustomLabel(customLabel, index, category);

        return [humanize(stringName), getValueFormatted(Number(value), legendFormatType)];
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

const getLegendFormatType = (index: number, formats?: string[], legendFormatType?: LegendFormatType) => {
    if (formats && formats[index] === 'percentage') return 'percentage';
    if (formats && formats[index] === 'money') return 'money';
    return legendFormatType;
};

const Component = ({
    category,
    index,
    legendFormatType,
    formats,
    getLabelFunc,
    categoryColors,
}: {
    category: DefaultPayload;
    index: number;
    legendFormatType?: LegendFormatType;
    formats?: string[];
    getLabelFunc: (category: DefaultPayload, index: number, x?: LegendFormatType) => string[];
    categoryColors: Map<string, Color>;
}) => {
    const [label, value] = getLabelFunc(category, index, getLegendFormatType(index, formats, legendFormatType));
    const bgColor = categoryColors.get(category.name || '') || 'transparent';

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
                    getColorClassNames(bgColor, colorPalette.background).bgColor,
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
    formats,
    accumulated,
    legendFormatType,
    categoryColors,
}: ChartLegendSettings) => {
    const localPayload = payload || [];
    const getLabelFunc = getLabel(customLabel);

    return (
        <StyledLegend>
            {active &&
                localPayload.length > 0 &&
                (accumulated
                    ? localPayload
                          .map((category: DefaultPayload, index: number) => {
                              localPayload[index].value = Object.values(category.payload) // eslint-disable-line @typescript-eslint/no-unsafe-argument
                                  .filter((x: unknown) => x !== category.payload.name) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
                                  .map((_: unknown, j: number, arr: unknown[]) =>
                                      arr
                                          .filter((__: unknown, k: number) => k <= j)
                                          .reduce((prev: number, curr: unknown) => prev + Number(curr), 0),
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
                    : localPayload.map((category: DefaultPayload, index: number) => {
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
