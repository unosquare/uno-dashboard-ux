import React from 'react';
import styled from 'styled-components';
import { formatter, FormatTypes, humanize } from 'uno-js';
import { ChartTypes } from '../constants';
import { Ellipse } from '../Ellipse';
import { TooltipTitle, LabelInfo } from '../Text';

export enum LegendFormatTypes {
    NORMAL = 'normal',
    PERCENTAGE = 'percentage',
    MONEY = 'money',
    TENURE = 'tenure',
    NEGATIVE = 'negative',
}

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

const getCustomName = (customLabel: CustomOptions, index: number, category: any) =>
    customLabel.prefix
        ? `${customLabel.values[index]} ${category.name}`
        : `${category.name} ${customLabel.values[index]}`;

const getCustomValue = (customValue: CustomOptions, index: number, category: any) =>
    customValue.prefix
        ? `${customValue.values[index]} ${category.name}`
        : `${category.name} ${customValue.values[index]}`;

const getMaleFemaleLabel = (category: any) =>
    category.dataKey === 'female'
        ? `${humanize(category.dataKey)}: ${category.payload.femaleNumber} - ${Math.abs(category.payload.female)}%`
        : `${humanize(category.dataKey)}: ${category.payload.maleNumber} - ${category.payload.male}%`;

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
            name = getCustomName(customLabel, index, category);
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
    const legendTitle = localPayload.length > 0 ? localPayload.map((c: any) => c.payload.name) : '0';
    const getLabelFunc = getLabel(customLabel, customValue);

    if (localPayload.some((c: any) => c.payload.name === 'IgnoreToolTip')) return payload[0].payload.label;

    return (
        <StyledLegend>
            {title && <TooltipTitle>{legendTitle[0]}</TooltipTitle>}
            {active &&
                localPayload.length > 0 &&
                localPayload.map((category: any, index: number) => {
                    // NOTE: accumulated for stacks of 2 values only
                    if (accumulated && index % 2 === 0) {
                        if (localPayload[index + 1].value > localPayload[index].value) {
                            localPayload[index + 1].value += localPayload[index].value;
                        } else {
                            localPayload[index].value += localPayload[index + 1].value;
                        }
                    }
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
                })}
        </StyledLegend>
    );
};
