import React from 'react';
import styled from 'styled-components';
import { device } from '../theme';

interface TitleSettings {
    children: React.ReactNode;
    width?: string;
    center?: boolean;
}

interface TextSettings {
    children: React.ReactNode;
}

const StyledTitle = styled.div<TitleSettings>`
    color: ${({ theme }) => theme.colors.fontMain};
    width: ${({ width }) => width || ''};
    max-width: 350px;
    display: flex;
    flex-direction: column;
    ${({ center }) => center && 'text-align: center;'}
    h2 {
        font-size: 40px;
        font-weight: 700;
        letter-spacing: 4px;
        line-height: 40px;
        text-transform: uppercase;
        margin: 0px;
    }
    h3 {
        font-size: 36px;
        font-weight: 700;
        letter-spacing: 2px;
        line-height: 36px;
        text-transform: uppercase;
        margin: 0px;
    }
    h4 {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 1.5px;
        line-height: 32px;
        text-transform: uppercase;
        margin: 0px;
        margin-bottom: 10px;
    }
    h5 {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 1.25px;
        line-height: 28px;
        text-transform: uppercase;
        margin: 0px;
        margin-bottom: 10px;
    }
    h6 {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
        line-height: 28px;
        text-transform: uppercase;
        margin: 0px;
        margin-bottom: 10px;
    }
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
    ${device.md} {
        margin-left: 20px;
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

const StyledRevenue = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    color: ${({ theme }) => theme.colors.fontMain};
    h2 {
        font-size: 60px;
        line-height: 60px;
        margin: 0px 0px 20px;
    }
    h5 {
        font-size: 20px;
        margin: 0px;
    }
`;

const StyledCenteredBoldSpan = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    padding-left: 6px;
    padding-bottom: 5px;
    padding-top: 3px;
`;

const StyledLeftSpan = styled.div`
    display: flex;
    align-items: left;
    padding-left: 6px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
`;

export const Title = ({ children, width, center }: TitleSettings) => (
    <StyledTitle width={width} center={center}>
        {children}
    </StyledTitle>
);

export const LabelWithImage = ({ children }: TextSettings) => <StyledLabelWithImage>{children}</StyledLabelWithImage>;

export const LabelWithIcon = ({ children }: TextSettings) => <StyledLabelWithIcon>{children}</StyledLabelWithIcon>;

export const Revenue = ({ children }: TextSettings) => <StyledRevenue>{children}</StyledRevenue>;

export const CenteredSpan = ({ children }: TextSettings) => <StyledCenteredSpan>{children}</StyledCenteredSpan>;

export const TooltipTitle = ({ children }: TextSettings) => <StyledCenteredBoldSpan>{children}</StyledCenteredBoldSpan>;

export const LabelInfo = ({ children }: TextSettings) => <StyledLeftSpan>{children}</StyledLeftSpan>;
