import React from 'react';
import tw from 'tailwind-styled-components';
import { formatter, FormatTypes, humanize } from 'uno-js';
import objectHash from 'object-hash';
import { ChartTypes, HasChildrenComponent, LegendFormatTypes } from '../constants';
import { Ellipse } from '../Ellipse';
import { translateFormat } from '../utils';

const StyledCenteredBoldSpan = tw.div`
    flex 
    items-center 
    font-bold 
    text-sm 
    pl-1 
    pb-1 
    pt-1
`;

const StyledLeftSpan = tw.div`
    flex 
    pl-1 
    text-xs
    items-start
`;

const TooltipTitle = ({ children }: HasChildrenComponent) => (
    <StyledCenteredBoldSpan>{children}</StyledCenteredBoldSpan>
);

const LabelInfo = ({ children }: HasChildrenComponent) => <StyledLeftSpan>{children}</StyledLeftSpan>;

export interface ChartLegendSettings {
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
}

export interface CustomOptions {
    prefix: boolean;
    values: string[];
}

const getColor = (type: ChartTypes, category: any) => {
    switch (type) {
        case ChartTypes.BAR:
            return category.fill;
        case ChartTypes.LINE:
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
        if (legendFormatType === LegendFormatTypes.TENURE) return `Month ${category.payload.x}: ${category.value} DPs`;

        let { name, value } = category;

        if (ignoreValue && value === 0.001) value = 0;

        if (customLabel && customLabel.values.length > 0) name = getCustomLabel(customLabel, index, category);

        if (customValue && customValue.values.length > 0) value = getCustomValue(customValue, index, category);

        if (legendFormatType === LegendFormatTypes.MONEY || legendFormatType === LegendFormatTypes.PERCENTAGE)
            return `${humanize(name)}: ${formatter(value, translateFormat(legendFormatType))}`;

        return `${humanize(name)}: ${legendFormatType === LegendFormatTypes.NEGATIVE ? value : Math.abs(value)}`;
    };

const StyledLegend = tw.div`
    text-maingray
    bg-white
    shadow-legend
    flex
    flex-col
    justify-center
    items-center
    p-[5px]
    [&_div]:flex
    [&_div]:flex-row
    [&_div]:justify-between
    [&_div]:w-full
    [&_span]:!font-medium
    [&_span]:!text-xs
    [&_span]:!text-gray-800
    [&_span]:m-0
`;

const getLegendFormatType = (formats: any, index: number, legendFormatType: LegendFormatTypes) => {
    if (formats && formats[index] === FormatTypes.PERCENTAGE) return LegendFormatTypes.PERCENTAGE;
    if (formats && formats[index] === FormatTypes.MONEY) return LegendFormatTypes.MONEY;

    return legendFormatType;
};

const Component = ({ type, category, index, legendFormatType, formats, getLabelFunc }: any) => (
    <div>
        <Ellipse color={getColor(type, category)} />
        <LabelInfo>{getLabelFunc(category, index, getLegendFormatType(formats, index, legendFormatType))}</LabelInfo>
    </div>
);

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
                                  .map((y: any, j: any, arr: any[]) =>
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
