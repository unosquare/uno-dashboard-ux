import React from 'react';
import styled from 'styled-components';
import { formatter, FormatTypes, humanize } from 'uno-js';
import { ChartTypes } from '../constants';
import { Ellipse } from '../Ellipse';
import { TooltipTitle, LabelInfo } from '../Text';

export interface ChartLegendSettings {
    active?: boolean;
    payload?: any;
    type: ChartTypes;
    percentage?: boolean;
    customValue?: CustomOptions;
    customLabel?: CustomOptions;
    tenure?: boolean;
    money?: boolean;
    allownegative?: boolean;
    title?: boolean;
    ignoreValue?: boolean;
    formats?: any[];
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

const getLabel = (
    customLabel: CustomOptions | undefined,
    customValue: CustomOptions | undefined,
    category: any,
    index: number,
    percentage = false,
    tenure = false,
    money = false,
    allownegative = false,
    ignoreValue = false,
) => {
    if (tenure) {
        return `Month ${category.payload.x}: ${category.value} DPs`;
    }
    if (category.payload.maleNumber || category.payload.femaleNumber) {
        return category.dataKey === 'female'
            ? `${humanize(category.dataKey)}: ${category.payload.femaleNumber} - ${Math.abs(category.payload.female)}%`
            : `${humanize(category.dataKey)}: ${category.payload.maleNumber} - ${category.payload.male}%`;
    }
    let { name } = category;
    let { value } = category;
    if (ignoreValue && value === 0.001) value = 0;
    if (customLabel && customLabel.values.length > 0) {
        name = customLabel.prefix
            ? `${customLabel.values[index]} ${category.name}`
            : `${category.name} ${customLabel.values[index]}`;
    }

    if (customValue && customValue.values.length > 0) {
        value = customValue.prefix
            ? `${customValue.values[index]} ${category.name}`
            : `${category.name} ${customValue.values[index]}`;
    }

    if (money) {
        return `${humanize(name)}: ${formatter(value, FormatTypes.MONEY)}`;
    }

    if (allownegative) {
        return `${humanize(name)}: ${value}${percentage ? '%' : ''}`;
    }

    return `${humanize(name)}: ${Math.abs(value)}${percentage ? '%' : ''}`;
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
    percentage,
    customLabel,
    customValue,
    tenure,
    money,
    allownegative,
    title = false,
    ignoreValue,
    formats,
    accumulated,
}: ChartLegendSettings) => {
    const localPayload = payload || [];
    let legendTitle = '0';

    if (localPayload.length > 0) legendTitle = localPayload.map((c: any) => c.payload.name);

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
                            {formats ? (
                                <LabelInfo>
                                    {getLabel(
                                        customLabel,
                                        customValue,
                                        category,
                                        index,
                                        formats[index] === FormatTypes.PERCENTAGE,
                                        tenure,
                                        formats[index] === FormatTypes.MONEY,
                                        allownegative,
                                        ignoreValue,
                                    )}
                                </LabelInfo>
                            ) : (
                                <LabelInfo>
                                    {getLabel(
                                        customLabel,
                                        customValue,
                                        category,
                                        index,
                                        percentage,
                                        tenure,
                                        money,
                                        allownegative,
                                        ignoreValue,
                                    )}
                                </LabelInfo>
                            )}
                        </div>
                    );
                })}
        </StyledLegend>
    );
};
