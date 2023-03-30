import React from 'react';
import tw from 'tailwind-styled-components';
import { Colors, SizeValues } from '../constants';

export interface CircleSettings {
    size?: SizeValues;
    color?: Colors;
    value?: string | number;
    subValue?: string | number;
}

const calculateSize = (size: SizeValues) => {
    switch (size) {
        case SizeValues.SMALL:
            return `
                min-w-[100px]
                min-h-[100px]
                max-h-[100px]
                my-[15px]
                mx-auto
                [&_span]:text-3xl
            `;
        case SizeValues.SMALL_INTER:
            return `
                min-w-[50px]
                min-h-[50px]
                max-h-[80px]
                text-base
                m-0
                [&_span]:text-white
            `;
        case SizeValues.EXTRA_SMALL:
            return `
                min-w-[50px]
                min-h-[50px]
                max-h-[50px]
                m-0
                [&_span]:text-base
            `;
        case SizeValues.MEDIUM:
            return `
                min-w-[115px]
                min-h-[115px]
                max-h-[115px]
                [&_span]:text-base
                m-5
            `;
        case SizeValues.LARGE_PADDED:
            return '[&_span]:text-2xl';
        case SizeValues.MICRO:
            return `
                m-0
                min-h-[35px]
                max-h-[35px]
                min-w-[35px]
                [&_span]:text-[11px]
                md:h-[25px]
                md:min-w-[25px]
                `;
        default:
            return '[&_span]:text-base';
    }
};

interface StyledCircleSettings {
    size: SizeValues;
    color: Colors;
}

const StyledCircle = tw.div<StyledCircleSettings>`
    rounded-[50%]
    flex
    justify-center
    items-center
    flex-col
    [&_h6]:text-4xl
    [&_h6]:font-bold
    [&_h6]:leading-[50px]
    [&_h6]:text-center
    [&_h6]:m-0
    [&_span]:font-bold
    [&_span]:text-center
    sm:m-[5px]
    min-w-[131px]
    min-h-[131px]
    max-h-[131px]
    my-5
    mx-[45px]
    ${({ size }) => calculateSize(size)}
    ${({ color }) =>
        color === Colors.BLUE
            ? `
            bg-unoblue
            text-white
      `
            : `
            bg-unolightgray
            text-maingray
    `}
    [&_span]:leading-[30px]
`;

const Label = ({ size, value }: any) => {
    if (size === SizeValues.LARGE) return <h6>{value}</h6>;
    if (size === SizeValues.MEDIUM) return <h1>{value}</h1>;

    return <span>{value}</span>;
};

export const Circle = ({ value, subValue, color = Colors.BLUE, size = SizeValues.LARGE }: CircleSettings) => (
    <StyledCircle color={color} size={size}>
        <Label size={size} value={value} />
        {size === SizeValues.LARGE && subValue && <span>{subValue}</span>}
    </StyledCircle>
);
