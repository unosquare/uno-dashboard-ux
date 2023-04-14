import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { Directions, FlexValues, HasChildrenComponent, SizeValues } from '../constants';

export interface CardSettings extends HasChildrenComponent {
    column: number;
    row: number;
    direction: Directions;
    justify?: FlexValues;
    align?: FlexValues;
    extraBottom?: boolean;
    height?: string;
    fit?: boolean;
    start?: number;
    end?: number;
    onClick?: () => void;
    isActive?: boolean;
    extraStyles?: string;
}

export interface CardContentSettings extends HasChildrenComponent {
    direction: Directions;
    size: SizeValues;
    justify?: FlexValues;
    align?: FlexValues;
    show?: boolean;
    smallHeight?: boolean;
}

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

const getHeight = (height: string | undefined, fit: boolean | undefined) => {
    if (height) return height;
    return fit ? 'fit-content' : 'auto';
};

const CardBase = styled.div<CardSettings>`
    flex-direction: ${({ direction }) => direction};
    grid-row: span ${({ row }) => row};
    grid-column: span ${({ column }) => column};
    ${({ start }) => start && `grid-column-start: ${start};`}
    ${({ end }) => end && `grid-column-end: ${end};`}
    align-items: ${({ align }) => align};
    justify-content: ${({ justify }) => justify};
    height: ${({ height, fit }) => getHeight(height, fit)};
    padding: ${({ extraBottom }) => (extraBottom ? '15px 10px 35px' : '15px 10px')};
    ${({ isActive }) => isActive && 'border: 1px solid #304ff3;'}
    ${({ onClick }) => onClick && 'cursor: pointer;'}
`;

const StyledCard = tw(CardBase)<CardSettings>`
    bg-white
    flex
    relative
    h-max
    max-h-full
    min-h-[170px]
    min-w-0
    rounded-lg
    shadow-card
    md:!justify-center
    md:!min-h-[200px]
    md:!p-[15px_25px]
    md:!col-span-1
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
    extraStyles,
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
        className={extraStyles}
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
