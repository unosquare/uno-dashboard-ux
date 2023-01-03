import React from 'react';
import styled from 'styled-components';
import { formatter, FormatTypes, humanize } from 'uno-js';
import objectHash from 'object-hash';
import { ChartTypes, LegendFormatTypes } from '../constants';
import { Ellipse } from '../Ellipse';
import { LabelInfo, TooltipTitle } from '../Text';

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

const getMaleFemaleLabel = ({ dataKey, payload }: any) =>
    dataKey === 'female'
        ? `${humanize(dataKey)}: ${payload.femaleNumber} - ${Math.abs(payload.female)}%`
        : `${humanize(dataKey)}: ${payload.maleNumber} - ${payload.male}%`;

const getLabel =
    (customLabel: CustomOptions | undefined, customValue: CustomOptions | undefined, ignoreValue: boolean) =>
    (category: any, index: number, legendFormatType?: LegendFormatTypes, percentage = false, money = false) => {
        if (legendFormatType === LegendFormatTypes.TENURE) {
            return `Month ${category.payload.x}: ${category.value} DPs`;
        }

        if (category.payload.maleNumber || category.payload.femaleNumber) {
            return getMaleFemaleLabel(category);
        }

        let { name, value } = category;

        if (ignoreValue && value === 0.001) value = 0;

        if (customLabel && customLabel.values.length > 0) {
            name = getCustomLabel(customLabel, index, category);
        }

        if (customValue && customValue.values.length > 0) {
            value = getCustomValue(customValue, index, category);
        }

        if (money) {
            return `${humanize(name)}: ${formatter(value, FormatTypes.MONEY)}`;
        }

        value = legendFormatType === LegendFormatTypes.NEGATIVE ? value : Math.abs(value);

        return `${humanize(name)}: ${value}${percentage ? '%' : ''}`;
    };

const StyledLegend = styled.div`
    box-shadow: 0 0px 2px 0px ${({ theme }) => theme.colors.blackOpacity};
    -moz-box-shadow: 0 0px 2px 0px ${({ theme }) => theme.colors.blackOpacity};
    -webkit-box-shadow: 0 0px 2px 0px ${({ theme }) => theme.colors.blackOpacity};
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.fontMain};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }
    span {
        font-weight: 500 !important;
        font-size: 12px !important;
        margin: 0px;
    }
`;

const Component = ({ type, category, index, legendFormatType, formats, getLabelFunc }: any) => (
    <div>
        <Ellipse color={getColor(type, category)} />
        <LabelInfo>
            {getLabelFunc(
                category,
                index,
                legendFormatType,
                formats ? formats[index] === FormatTypes.PERCENTAGE : legendFormatType === LegendFormatTypes.PERCENTAGE,
                formats ? formats[index] === FormatTypes.MONEY : legendFormatType === LegendFormatTypes.MONEY,
            )}
        </LabelInfo>
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
