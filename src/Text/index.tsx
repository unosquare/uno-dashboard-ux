import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { HasChildrenComponent } from '../constants';

interface TitleSettings extends HasChildrenComponent {
    width?: string;
    center?: boolean;
}

interface SubtitleSettings extends HasChildrenComponent {
    rightAlign?: boolean;
    margin?: boolean;
}

const WrapperTitle = tw.div`
    text-gray-700
    tracking-wide
    uppercase
    font-bold
    [&_h2]:text-4xl
    [&_h2]:m-0
    [&_h3]:text-3xl
    [&_h3]:m-0
    [&_h4]:text-2xl
    [&_h4]:m-0
    [&_h5]:text-xl
    [&_h5]:m-0
    [&_h6]:text-lg
    [&_h6]:m-0
`;

const StyledTitle = styled.div<TitleSettings>`
    width: ${({ width }) => width || ''};
    max-width: 350px;
    display: flex;
    flex-direction: column;
    ${({ center }) => center && 'text-align: center;'}
`;

const StyledCenteredSpan = tw.span`
    flex 
    items-center
`;

const StyledCenteredBoldSpan = tw.div`
    flex 
    items-center 
    font-bold 
    text-sm 
    pl-1 
    pb-1 
    pt-1
`;

const StyledLeftSpan = tw.div`
    flex 
    pl-1 
    text-xs
    items-start
`;

const StyledSubTitle = tw.div<SubtitleSettings>`
    m-0
    mb-10
    ${({ margin }) => (margin ? 'mt-auto' : 'mt-0')};
    ${({ rightAlign }) => (rightAlign ? 'text-right' : 'text-left')};
    text-gray-700
    text-base
    font-medium
    block
    flex
    flex-col
    text-gray-700
    [&_h2]:text-4xl
    [&_h2]:m-0
    [&_h3]:text-3xl
    [&_h3]:m-0
    [&_h4]:text-2xl
    [&_h4]:m-0
    [&_h5]:text-xl
    [&_h5]:m-0
    [&_h6]:text-lg
    [&_h6]:m-0
`;

export const Title = ({ children, width, center }: TitleSettings) => (
    <StyledTitle width={width} center={center}>
        <WrapperTitle>{children}</WrapperTitle>
    </StyledTitle>
);

export const SubTitle = ({ children, ...props }: SubtitleSettings) => (
    <StyledSubTitle {...props}>{children}</StyledSubTitle>
);

export const CenteredSpan = ({ children }: HasChildrenComponent) => <StyledCenteredSpan>{children}</StyledCenteredSpan>;

export const TooltipTitle = ({ children }: HasChildrenComponent) => (
    <StyledCenteredBoldSpan>{children}</StyledCenteredBoldSpan>
);

export const LabelInfo = ({ children }: HasChildrenComponent) => <StyledLeftSpan>{children}</StyledLeftSpan>;
