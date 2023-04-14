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
    ul {
        width: 100%;
        margin: 0px;
        padding: 0px;
        font-size: 16px;
        text-align: justify;
        list-style-type: none;
    }
    li {
        margin: 15px 3px;
        line-height: 22px;
    }
    span {
        margin: 0px;
        font-size: 16px;
        width: 100%;
        text-align: start;
        margin-bottom: auto;
        font-weight: 500;
        display: flex;
        align-items: center;
    }
    strong {
        justify-content: space-between;
        display: flex;
        div {
            display: flex;
            align-items: center;
            width: 50px;
            justify-content: space-between;
        }
    }
`;

const StyledLabelWithImage = styled.div`
    color: ${({ theme }) => theme.colors.fontMain};
    margin-bottom: 10px;
    display: flex;
    span {
        font-size: 16px;
        letter-spacing: 0.8px;
        line-height: 21px;
    }
    strong {
        font-size: 18px;
        letter-spacing: 0.8px;
        line-height: 21px;
    }
    img {
        margin-right: 10px;
        height: 20px;
        object-fit: contain;
        width: 22px;
    }
`;

const StyledCenteredSpan = styled.span`
    display: flex;
    align-items: center;
`;

const StyledLabelWithIcon = styled.div`
    width: 130px;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    color: ${({ theme }) => theme.colors.fontMain};
    span {
        font-size: 14px;
        letter-spacing: 0.8px;
        line-height: 21px;
    }
    strong {
        font-size: 18px;
        letter-spacing: 0.8px;
        line-height: 21px;
    }
`;

const StyledCenteredBoldSpan = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    padding-left: 6px;
    padding-bottom: 5px;
    padding-top: 3px;
`;

const StyledLeftSpan = styled.div`
    display: flex;
    align-items: left;
    padding-left: 6px;
    font-size: 12px;
`;

const StyledSubTitle = tw.p<SubtitleSettings>`
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

export const LabelWithImage = ({ children }: HasChildrenComponent) => (
    <StyledLabelWithImage>{children}</StyledLabelWithImage>
);

export const LabelWithIcon = ({ children }: HasChildrenComponent) => (
    <StyledLabelWithIcon>{children}</StyledLabelWithIcon>
);

export const SubTitle = ({ children, ...props }: SubtitleSettings) => (
    <StyledSubTitle {...props}>{children}</StyledSubTitle>
);

export const CenteredSpan = ({ children }: HasChildrenComponent) => <StyledCenteredSpan>{children}</StyledCenteredSpan>;

export const TooltipTitle = ({ children }: HasChildrenComponent) => (
    <StyledCenteredBoldSpan>{children}</StyledCenteredBoldSpan>
);

export const LabelInfo = ({ children }: HasChildrenComponent) => <StyledLeftSpan>{children}</StyledLeftSpan>;
