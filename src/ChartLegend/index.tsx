import React from 'react';
import styled from 'styled-components';
import { formatter, FormatTypes, humanize } from 'uno-js';
import { ChartTypes, LegendFormatTypes } from '../constants';
import { Ellipse } from '../Ellipse';
import { TooltipTitle, LabelInfo } from '../Text';

export interface ChartLegendSettings {
    active?: boolean;
    payload?: any;
    type: ChartTypes;
    customValue?: CustomOptions;
    customLabel?: CustomOptions;
    legendFormatType?: LegendFormatTypes;
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

const getCustom = ({ values, prefix }: CustomOptions, index: number, { name }: any) =>
    prefix ? `${values[index]} ${name}` : `${name} ${values[index]}`;

const getMaleFemaleLabel = ({ dataKey, payload }: any) =>
    dataKey === 'female'
        ? `${humanize(dataKey)}: ${payload.femaleNumber} - ${Math.abs(payload.female)}%`
        : `${humanize(dataKey)}: ${payload.maleNumber} - ${payload.male}%`;

const getLabel =
    (customLabel: CustomOptions | undefined, customValue: CustomOptions | undefined) =>
    (
        category: any,
        index: number,
        legendFormatType?: LegendFormatTypes,
        percentage = false,
        money = false,
        ignoreValue = false,
    ) => {
        if (legendFormatType === LegendFormatTypes.TENURE) {
            return `Month ${category.payload.x}: ${category.value} DPs`;
        }

        if (category.payload.maleNumber || category.payload.femaleNumber) {
            return getMaleFemaleLabel(category);
        }

        let { name, value } = category;

        if (ignoreValue && value === 0.001) value = 0;
        if (customLabel && customLabel.values.length > 0) {
            name = getCustom(customLabel, index, category);
        }

        if (customValue && customValue.values.length > 0) {
            value = getCustom(customValue, index, category);
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

export const ChartLegend = ({
    active,
    payload,
    type,
    customLabel,
    customValue,
    ignoreValue,
    formats,
    accumulated,
    legendFormatType,
    title = false,
}: ChartLegendSettings) => {
    const localPayload = payload || [];
    const legendTitle = localPayload.length > 0 ? localPayload[0].payload.name : '0';
    const getLabelFunc = getLabel(customLabel, customValue);

    if (localPayload.some((c: any) => c.payload.name === 'IgnoreToolTip')) return payload[0].payload.label;

    return (
        <StyledLegend>
            {title && <TooltipTitle>{legendTitle}</TooltipTitle>}
            {active &&
                localPayload.length > 0 &&
                localPayload
                    .map((category: any, index: number) => {
                        if (accumulated)
                            localPayload[index].value = Object.values(category.payload)
                                .filter((x: any) => x !== category.payload.name)
                                .sort()
                                .map((y: any, j: any, arr: any[]) => (j === arr.length - 1 ? y + arr[j - 1] : y))[
                                index
                            ];

                        return (
                            <div key={index}>
                                <Ellipse color={getColor(type, category)} />
                                <LabelInfo>
                                    {getLabelFunc(
                                        category,
                                        index,
                                        legendFormatType,
                                        formats
                                            ? formats[index] === FormatTypes.PERCENTAGE
                                            : legendFormatType === LegendFormatTypes.PERCENTAGE,
                                        formats
                                            ? formats[index] === FormatTypes.MONEY
                                            : legendFormatType === LegendFormatTypes.MONEY,
                                        ignoreValue,
                                    )}
                                </LabelInfo>
                            </div>
                        );
                    })
                    .reverse()}
        </StyledLegend>
    );
};
