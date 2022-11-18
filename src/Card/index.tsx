import React from 'react';
import styled from 'styled-components';
import { Directions, FlexValues, SizeValues } from '../constants';
import { device } from '../theme';

export interface CardSettings {
    column: number;
    row: number;
    direction: Directions;
    children: React.ReactNode;
    justify?: FlexValues;
    align?: FlexValues;
    extraBottom?: boolean;
    height?: string;
    fit?: boolean;
    start?: number;
    end?: number;
    onClick?: () => void;
    isActive?: boolean;
}

export interface CardContentSettings {
    direction: Directions;
    size: SizeValues;
    children: React.ReactNode;
    justify?: FlexValues;
    align?: FlexValues;
    show?: boolean;
    smallHeight?: boolean;
}

const getHeight = (height: string | undefined, fit: boolean | undefined) => {
    if (height) return height;
    return fit ? 'fit-content' : 'auto';
};

const calculateSize = (size: SizeValues) => {
    switch (size) {
        case SizeValues.LARGE:
            return '100%';
        case SizeValues.MEDIUM_INTER:
            return '66%';
        case SizeValues.SMALL:
            return '25%';
        default:
            return '50%';
    }
};

const StyledCard = styled.div<CardSettings>`
    box-shadow: 0 1px 3px 0px ${({ theme }) => theme.colors.blackOpacity};
    -moz-box-shadow: 0 1px 3px 0px ${({ theme }) => theme.colors.blackOpacity};
    -webkit-box-shadow: 0 1px 3px 0px ${({ theme }) => theme.colors.blackOpacity};
    background: ${({ theme }) => theme.colors.cardBackground};
    grid-row: span ${({ row }) => row};
    grid-column: span ${({ column }) => column};
    ${({ start }) => start && `grid-column-start: ${start};`}
    ${({ end }) => end && `grid-column-end: ${end};`}
    flex-direction: ${({ direction }) => direction};
    display: flex;
    align-items: ${({ align }) => align};
    padding: ${({ extraBottom }) => (extraBottom ? '15px 10px 35px' : '15px 10px')};
    justify-content: ${({ justify }) => justify};
    position: relative;
    min-height: 170px;
    max-height: 100%;
    height: ${({ height, fit }) => getHeight(height, fit)};
    border-radius: 0.25rem;
    ${({ isActive }) => isActive && 'border: 1px solid #304ff3;'}
    ${({ onClick }) => onClick && 'cursor: pointer;'}
    ${device.md} {
        grid-column: span ${({ column }) => (column > 1 ? 6 : 2)};
        justify-content: center;
        padding: 15px 25px;
        min-height: 200px;
    }
`;

const StyledCardContent = styled.div<CardContentSettings>`
    flex-direction: ${({ direction }) => direction};
    display: ${({ show }) => (show ? 'flex' : 'none')};
    align-items: ${({ align }) => align};
    justify-content: ${({ justify }) => justify};
    width: ${({ size }) => calculateSize(size)};
    max-height: ${({ smallHeight }) => (smallHeight ? '20%' : '100%')};
    height: 100%;
`;

export const Card = ({
    column,
    direction,
    row,
    children,
    justify = FlexValues.CENTER,
    align = FlexValues.CENTER,
    extraBottom,
    height,
    fit,
    start,
    end,
    onClick,
    isActive,
}: CardSettings) => (
    <StyledCard
        column={column}
        direction={direction}
        row={row}
        justify={justify}
        align={align}
        extraBottom={extraBottom}
        height={height}
        fit={fit}
        start={start}
        end={end}
        onClick={onClick}
        isActive={isActive}
    >
        {children}
    </StyledCard>
);

export const CardContent = ({
    direction,
    size,
    children,
    justify = FlexValues.CENTER,
    align = FlexValues.CENTER,
    show = true,
    smallHeight,
}: CardContentSettings) => (
    <StyledCardContent
        direction={direction}
        size={size}
        justify={justify}
        align={align}
        show={show}
        smallHeight={smallHeight}
    >
        {children}
    </StyledCardContent>
);
