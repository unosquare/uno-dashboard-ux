import React from 'react';
import tw from 'tailwind-styled-components';

export interface FooterSettings {
    transparent?: boolean;
    copyright?: string;
}

const StyledFooter = tw.footer<FooterSettings>`
    w-full
    h-10
    pt-3
    text-center
    ${({ transparent }) => (transparent ? 'bg-transparent' : 'bg-black')}
    ${({ transparent }) => (transparent ? 'text-black' : 'text-white')}
    text-sm
    fixed
    bottom-0
    z-30
    box-content
`;

export const Footer = ({ transparent, copyright = 'Copyright © Unosquare, LLC' }: FooterSettings) => (
    <StyledFooter transparent={transparent}>
        <span>{copyright}</span>
    </StyledFooter>
);
