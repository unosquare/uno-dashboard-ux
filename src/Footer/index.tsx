import React from 'react';
import styled from 'styled-components';

export interface FooterSettings {
    transparent?: boolean;
    copyright?: string;
}

const StyledFooter = styled.div<FooterSettings>`
    background-color: ${({ theme, transparent }) =>
        transparent ? theme.colors.background : theme.colors.footerBackground};
    width: 100%;
    height: 40px;
    padding-top: 20px;
    text-align: center;
    color: ${({ theme, transparent }) => (transparent ? theme.colors.fontMain : theme.colors.fontSecondary)};
    font-size: 14px;
    position: fixed;
    bottom: 0px;
    z-index: 2000;
`;

export const Footer = ({ transparent, copyright = 'Copyright © Unosquare, LLC' }: FooterSettings) => (
    <StyledFooter transparent={transparent}>
        <span>{copyright}</span>
    </StyledFooter>
);
