import React from 'react';
import styled from 'styled-components';
import { Colors, SizeValues } from '../constants';
import { device } from '../theme';

export interface CircleSettings {
    size: SizeValues;
    color: Colors;
    value?: string | number;
    subValue?: string | number;
}

const calculateSize = (size: SizeValues) => {
    switch (size) {
        case SizeValues.SMALL:
            return `
                min-width: 100px;
                min-height: 100px;
                max-height: 100px;
                margin: 15px auto;
                span {
                  font-size: 30px;
                };
            `;
        case SizeValues.SMALL_INTER:
            return `
                min-width: 50px;
                min-height: 50px;
                max-height: 80px;
                font-size: 16px;
                margin: 5px 5px 0px auto
                span {
                  color: '#fff';
                };
            `;
        case SizeValues.EXTRA_SMALL:
            return `
                min-width: 50px;
                min-height: 50px;
                max-height: 50px;
                margin: 5px 5px 0px auto
                span {
                    font-size: 22px;
                };
            `;
        case SizeValues.MEDIUM:
            return `
                min-width: 115px;
                min-height: 115px;
                max-height: 115px;
                margin: 20px 20px;
                span {
                  font-size: 16px;
                };
            `;
        case SizeValues.LARGE_PADDED:
            return `
                min-width: 131px;
                min-height: 131px;
                max-height: 131px;
                margin: 20px 45px;
                span {
                  font-size: 24px;
                };
            `;
        case SizeValues.MICRO:
            return `
                    height: 35px;
                    min-width: 35px;
                    span {
                        font-size: 10px;
                    };
                    ${device.md} {
                        height: 25px;
                        min-width: 25px;
                    }
                `;
        default:
            return `
                min-width: 131px;
                min-height: 131px;
                max-height: 131px;
                margin: 20px 45px;
                span {
                  font-size: 16px;
                };
            `;
    }
};

const StyledCircle = styled.div<CircleSettings>`
    ${({ size }) => calculateSize(size)}
    ${({ color, theme }) => {
        if (color === Colors.BLUE) {
            return `
        background: ${theme.colors.main};
        color: ${theme.colors.fontSecondary};
      `;
        }
        return `
      background: ${theme.colors.background};
      color: ${theme.colors.fontMain};
    `;
    }};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h6 {
        font-size: 50px;
        font-weight: 700;
        line-height: 50px;
        text-align: center;
        margin: 0px;
    }
    span {
        font-weight: 700;
        line-height: 30px;
        text-align: center;
    }
    ${device.sm} {
        margin: 5px;
    }
`;

const Label = ({ size, value }: any) => {
    if (size === SizeValues.LARGE) return <h6>{value}</h6>;
    if (size === SizeValues.MEDIUM) return <h1>{value}</h1>;

    return <span>{value}</span>;
};

export const Circle = ({ value, subValue, color, size }: CircleSettings) => (
    <StyledCircle color={color} size={size}>
        <Label size={size} value={value} />
        {size === SizeValues.LARGE && subValue && <span>{subValue}</span>}
    </StyledCircle>
);
