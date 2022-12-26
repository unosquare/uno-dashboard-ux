import React from 'react';
import { Cell, Pie, PieChart as PieChartRechart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { formatter, FormatTypes } from 'uno-js';
import { ChartLegend } from '../ChartLegend';
import { ChartData, ChartTypes, Directions, LegendFormatTypes, SizeValues } from '../constants';
import { Ellipse } from '../Ellipse';
import { NoData, PieNoDataLegend } from '../NoData';
import { baseTheme, defaultChartPalette } from '../theme';

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
    size: SizeValues;
    direction: Directions;
}

export interface CategorySettings {
    direction: Directions;
    $money?: boolean;
}

const ChartBase = styled.div<ChartContainerSettings>`
    flex-direction: ${({ direction }) => direction};
`;

export const StyledChart = tw(ChartBase)<ChartContainerSettings>`
    ${({ size }) =>
        size === SizeValues.LARGE
            ? ` min-w-[300px]
                [&_h6]:text-start`
            : ` min-w-[auto]
                [&_h6]:text-center`}
    flex
    justify-between
    max-w-[500px]
    mx-auto
    [&_h6]:text-maingray
    [&_h6]:m-0
    [&_h6]:max-w-[265px]
    [&_span]:text-sm
    [&_span]:text-maingray
    [&_span]:text-[14px]
    md:[&_span]:text-[11px]
    text-center
    ${({ size }) => (size === SizeValues.MEDIUM_INTER ? '[&_h6]:text-[15px]' : '[&_h6]:text-[19px]')}
    ${({ size }) => (size === SizeValues.SMALL ? '[&_h6]:font-bold [&_h6]:mb-0' : '[&_h6]:font-medium [&_h6]:mb-5')}
    ${({ size }) =>
        size === SizeValues.SMALL &&
        `
        md:[&_span]:w-[70px]
        md:[&_span]:text-center`}
    [&_h6]:leading-[22px]
`;

export const StyledCategory = tw.div<CategorySettings>`
    flex
    mb-[5px]
    ${({ direction, $money }) =>
        direction === Directions.ROW
            ? `
        flex-col
        justify-center
        items-center
      `
            : `
        flex-row
        justify-start
        items-start
        [&_span]:text-end
        [&_span:last-child]:ml-[10px]
        [&_span:last-child]:mr-0
        [&_span:last-child]:w-auto
        ${$money ? '[&_span]:w-[60px]' : '[&_span]:w-[30px]'}
   `}
`;

const ContainerBase = styled.div<CategorySettings>`
    flex-direction: ${({ direction }) => direction};
`;

export const CategoryContainer = tw(ContainerBase)<CategorySettings>`
    flex
    justify-between
`;

export const StyledLabel = tw.div`
    flex
    flex-col
    content-center
    pl-[10px]
    justify-evenly
`;

export const SubValueStyled = tw.span`
    !text-[10px]
    font-medium
`;

export const ChartContainer = tw.div<ChartContainerSettings>`
    ${({ size }) => {
        switch (size) {
            case SizeValues.LARGE:
                return `
                    min-w-[170px]
                    h-[170px]
                `;
            case SizeValues.SMALL:
                return `
                    min-w-[55px]
                    h-[55px]
                `;
            default:
                return `
                    min-w-[120px]
                    h-[120px]
                `;
        }
    }}
`;

const getCategories = (
    data: ChartData[],
    subDirection: Directions,
    legendFormatType: LegendFormatTypes | undefined,
    colors: string[],
) => {
    const money = legendFormatType === LegendFormatTypes.MONEY;

    return data.map(({ value, name, subValue }, i) => (
        <StyledCategory direction={subDirection} key={i} $money={money}>
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
                    <CategoryContainer direction={subDirection}>
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
    colors = defaultChartPalette,
}: ChartSettings<any>) => {
    const dataStore: ChartData[] = (dataCallback && rawData && dataCallback(rawData)) || [];

    return (
        <StyledChart direction={direction} subDirection={subDirection} size={size}>
            {dataStore.length > 0 ? (
                <>
                    <ChartContainer direction={direction} size={size}>
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
