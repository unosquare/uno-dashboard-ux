import React from 'react';
import tw from 'tailwind-styled-components';
import { formatter, FormatTypes, humanize } from 'uno-js';
import objectHash from 'object-hash';
import { Flex, Text } from '@tremor/react';
import { ChartTypes, HasChildrenComponent, LegendFormatTypes } from '../constants';
import { Ellipse } from '../Ellipse';
import { translateFormat } from '../utils';

const TooltipTitle = ({ children }: HasChildrenComponent) => (
    <Flex alignItems='center' className='text-sm pl-1 pb-1 pt-1'>
        {children}
    </Flex>
);

export type ChartLegendSettings = {
    legendFormatType?: LegendFormatTypes;
    active?: boolean;
    payload?: any;
    type: ChartTypes;
    customValue?: CustomOptions;
    customLabel?: CustomOptions;
    title?: boolean;
    ignoreValue?: boolean;
    formats?: FormatTypes[];
    accumulated?: boolean;
};

export type CustomOptions = {
    prefix: boolean;
    values: string[];
};

const getColor = (type: ChartTypes, category: any) => {
    switch (type) {
        case 'bar':
            return category.fill;
        case 'line':
            return category.stroke;
        default:
            return category.payload.fill;
    }
};

const getCustomLabel = ({ values, prefix }: CustomOptions, index: number, { name }: any) =>
    prefix ? `${values[index]} ${name}` : `${name} ${values[index]}`;

const getCustomValue = ({ values, prefix }: CustomOptions, index: number, { value }: any) =>
    prefix ? `${values[index]} ${value}` : `${value} ${values[index]}`;

const getLabel =
    (customLabel: CustomOptions | undefined, customValue: CustomOptions | undefined, ignoreValue: boolean) =>
    (category: any, index: number, legendFormatType?: LegendFormatTypes) => {
        let { name, value } = category;

        if (ignoreValue && value === 0.001) value = 0;

        if (customLabel && customLabel.values.length > 0) name = getCustomLabel(customLabel, index, category);

        if (customValue && customValue.values.length > 0) value = getCustomValue(customValue, index, category);

        if (legendFormatType === 'money' || legendFormatType === 'percentage')
            return [humanize(name), formatter(value, translateFormat(legendFormatType))];

        return [humanize(name), `${legendFormatType === 'negative' ? value : Math.abs(value)}`];
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

const getLegendFormatType = (formats: any[], index: number, legendFormatType: LegendFormatTypes) => {
    if (formats && formats[index] === 'percentage') return 'percentage';
    if (formats && formats[index] === 'money') return 'money';
    return legendFormatType;
};

const Component = ({ type, category, index, legendFormatType, formats, getLabelFunc }: any) => {
    const [label, value] = getLabelFunc(category, index, getLegendFormatType(formats, index, legendFormatType));

    return (
        <Flex className='gap-2'>
            <Ellipse color={getColor(type, category)} />
            <Text>{label}</Text>
            <Text className='font-medium tabular-nums'>{value}</Text>
        </Flex>
    );
};

export const ChartLegend = ({
    active,
    payload,
    type,
    customLabel,
    customValue,
    ignoreValue = false,
    formats,
    accumulated,
    legendFormatType,
    title = false,
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
                                  type,
                                  category,
                                  index,
                                  legendFormatType,
                                  formats,
                                  getLabelFunc,
                              };
                              return <Component key={objectHash(options)} {...options} />;
                          })
                          .reverse()
                    : localPayload.map((category: any, index: number) => {
                          const options = {
                              type,
                              category,
                              index,
                              legendFormatType,
                              formats,
                              getLabelFunc,
                          };
                          return <Component key={objectHash(options)} {...options} />;
                      }))}
        </StyledLegend>
    );
};
