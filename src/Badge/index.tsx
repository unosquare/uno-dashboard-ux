import React from 'react';
import styled from 'styled-components';
import { Circle } from '../Circle';
import { SizeValues, Colors } from '../constants';
import { device } from '../theme';

export interface BadgeSettings {
    value: string | number;
    content: string;
    subContent?: string;
    top?: boolean;
    right?: number;
}

const StyledBadge = styled.div<BadgeSettings>`
    width: 120px;
    max-height: 50px;
    min-height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    position: absolute;
    ${({ top }) => (top ? 'top: 10px' : 'bottom: 10px')};
    bottom: 5px;
    ${({ right }) => `right: ${right || 20}px`};
    z-index: 3000;
`;

const StyledText = styled.div`
    width: 90px;
    max-height: 50px;
    min-height: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
        font-size: 10px;
        font-weight: 700;
        text-align: left;
        margin: 0px;
        margin-left: 3px;
        line-height: 12px;
    }
    span {
        font-size: 10px;
        text-align: left;
        margin: 0px 3px;
    }
    ${device.md} {
        width: 115px;
        p {
            font-size: 9px;
        }
    }
`;

export const Badge = ({ value, content, subContent, top, right }: BadgeSettings) => (
    <StyledBadge top={top} value={value} content={content} subContent={subContent} right={right}>
        <Circle size={SizeValues.MICRO} value={value} color={Colors.BLUE} />
        <StyledText>
            <p>{content}</p>
            {subContent && <span>{subContent}</span>}
        </StyledText>
    </StyledBadge>
);
