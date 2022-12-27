import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { Circle } from '../Circle';
import { Colors, SizeValues } from '../constants';

export interface BadgeSettings {
    value: string | number;
    content: string;
    subContent?: string;
    top?: boolean;
    right?: number;
}

const BadgeBase = styled.div<BadgeSettings>`
    ${({ top }) => (top ? 'top: 10px' : 'bottom: 5px')};
    ${({ right }) => `right: ${right || 20}px`};
`;

const StyledBadge = tw(BadgeBase)<BadgeSettings>`
    w-[120px]
    max-h-[50px]
    min-h-[35px]
    flex
    justify-between
    items-center
    flex-row
    absolute
    z-[3000]
`;

const StyledText = tw.div`
    w-[90px]
    max-h-[50px]
    min-h-[35px]
    flex
    flex-col
    justify-center
    [&_p]:text-[10px]
    [&_p]:font-bold
    [&_p]:text-left
    [&_p]:m-0
    [&_p]:ml-[3px]
    [&_p]:leading-3
    [&_span]:text-[10px]
    [&_span]:text-left
    [&_span]:my-0
    [&_span]:mx-[3px]
    md:[&_p]:text-[9px]
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
