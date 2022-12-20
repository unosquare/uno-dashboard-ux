import React from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';
import { formatter, FormatTypes } from 'uno-js';
import { ChartLegend } from '../ChartLegend';
import { ChartData, ChartTypes, Directions, LegendFormatTypes, SizeValues } from '../constants';
import { Ellipse } from '../Ellipse';
import { NoData, PieNoDataLegend } from '../NoData';
import { baseTheme, device } from '../theme';

interface ChartCommon {
    legendFormatType?: LegendFormatTypes;
    label?: string;
    subLabel?: string;
    capped?: number;
}

export interface ChartLabel extends ChartCommon {
    subDirection: Directions;
    size: SizeValues;
    dataStore: ChartData[];
    colors: string[];
}

export interface ChartSettings<TDataIn> extends ChartCommon {
    rawData?: TDataIn;
    dataCallback?: (data: TDataIn) => ChartData[];
    direction?: Directions;
    subDirection?: Directions;
    size?: SizeValues;
    noDataElement?: React.ReactNode;
    colors?: string[];
}

export interface ChartContainerSettings {
    subDirection: Directions;
    size: SizeValues;
    direction: Directions;
}

export interface CategorySettings {
    subDirection: Directions;
    money?: boolean;
}

export const StyledChart = styled.div<ChartContainerSettings>`
    ${({ size }) => {
        if (size === SizeValues.LARGE) {
            return `
      min-width: 300px;
      h6 {
        text-align: start;
      };
      `;
        }
        return `
    min-width: auto;
    h6 {
      text-align: center;
    };
    `;
    }};
    display: flex;
    justify-content: space-between;
    flex-direction: ${({ direction }) => direction};
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    h6 {
        color: ${({ theme }) => theme.colors.fontMain};
        font-size: ${({ size }) => (size === SizeValues.MEDIUM_INTER ? '15px' : '19px')};
        line-height: 22px;
        margin: 0px;
        font-weight: ${({ size }) => (size === SizeValues.SMALL ? 700 : 500)};
        max-width: 265px;
        margin-bottom: ${({ size }) => (size === SizeValues.SMALL ? '0px' : '20px')};
    }
    span {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.fontMain};
        ${({ size }) =>
            size === SizeValues.SMALL
                ? `
        width: 70px;
        text-align: center;`
                : ''};
    }
    ${device.md} {
        span {
            font-size: 11px;
        }
    }
`;

export const StyledCategory = styled.div<CategorySettings>`
    display: flex;
    ${({ subDirection, money }) => {
        if (subDirection === Directions.ROW) {
            return `
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `;
        }
        return `
        flex-direction: row;
        justify-content: start;
        align-items: start;
        span {
          width: ${money ? '60px' : '30px'};
          text-align: end;
        };
        span:last-child {
          margin-left: 10px;
          margin-right: 0px;
          width: auto;
        };
   `;
    }};
    margin-bottom: 5px;
`;

export const CategoryContainer = styled.div<CategorySettings>`
    display: flex;
    flex-direction: ${({ subDirection }) => subDirection};
    justify-content: space-between;
`;

export const StyledLabel = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    padding-left: 10px;
    justify-content: space-evenly;
`;

export const SubValueStyled = styled.span`
    font-size: 10px !important;
    font-weight: 500;
`;

export const ChartContainer = styled.div<ChartContainerSettings>`
    ${({ size }) => {
        switch (size) {
            case SizeValues.LARGE:
                return `
        min-width: 170px;
        height: 170px;
      `;
            case SizeValues.SMALL:
                return `
        min-width: 55px;
        height: 55px;
      `;
            default:
                return `
                min-width: 120px;
                height: 120px;
              `;
        }
    }};
`;

const getCategories = (
    data: ChartData[],
    subDirection: Directions,
    legendFormatType: LegendFormatTypes | undefined,
    colors: string[],
) => {
    const money = legendFormatType === LegendFormatTypes.MONEY;

    return data.map(({ value, name, subValue }, i) => (
        <StyledCategory subDirection={subDirection} key={i} money={money}>
            <Ellipse color={colors[i]} />
            {money ? (
                <>
                    <span>{name}</span>
                    <span>{formatter(value, FormatTypes.MONEY)}</span>
                </>
            ) : (
                <>
                    {subDirection === Directions.COLUMN && <span>{value}</span>}
                    <span>{name}</span>
                    {subValue && <SubValueStyled>{subValue}</SubValueStyled>}
                </>
            )}
        </StyledCategory>
    ));
};

const Label = ({ size, label, subLabel, dataStore, subDirection, legendFormatType, capped, colors }: ChartLabel) => {
    switch (size) {
        case SizeValues.LARGE: {
            const subset = getCategories(dataStore, subDirection, legendFormatType, colors);
            return (
                <StyledLabel>
                    <h6>{label}</h6>
                    <CategoryContainer subDirection={subDirection}>
                        {capped ? subset.splice(0, capped) : subset}
                    </CategoryContainer>
                </StyledLabel>
            );
        }
        case SizeValues.SMALL:
            return (
                <StyledLabel>
                    <h6>{label}</h6>
                    <span>{subLabel}</span>
                </StyledLabel>
            );
        default:
            return <h6>{label}</h6>;
    }
};

export const PieChart = ({
    label,
    subLabel,
    rawData,
    dataCallback,
    direction = Directions.ROW,
    subDirection = Directions.COLUMN,
    size = SizeValues.LARGE,
    legendFormatType,
    capped,
    noDataElement,
    colors = ['#22D3C5', '#009776', '#f65097', '#ff8300', '#304ff3', '#003d6e', '#d0dd28'],
}: ChartSettings<any>) => {
    const dataStore: ChartData[] = (dataCallback && rawData && dataCallback(rawData)) || [];

    return (
        <StyledChart direction={direction} subDirection={subDirection} size={size}>
            {dataStore.length > 0 ? (
                <>
                    <ChartContainer direction={direction} subDirection={subDirection} size={size}>
                        <ResponsiveContainer>
                            <PieChartRechart>
                                <Pie
                                    data={dataStore}
                                    dataKey='value'
                                    fill={baseTheme.colors.background}
                                    startAngle={90}
                                    endAngle={-360}
                                >
                                    {dataStore.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<ChartLegend legendFormatType={legendFormatType} type={ChartTypes.PIE} />}
                                />
                            </PieChartRechart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <Label
                        capped={capped}
                        dataStore={dataStore}
                        label={label}
                        legendFormatType={legendFormatType}
                        colors={colors}
                        size={size}
                        subDirection={subDirection}
                        subLabel={subLabel}
                    />
                </>
            ) : (
                <NoData>{noDataElement || <PieNoDataLegend />}</NoData>
            )}
        </StyledChart>
    );
};
