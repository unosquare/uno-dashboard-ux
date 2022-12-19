import React from 'react';
import tw from 'tailwind-styled-components';
import { UnoLogo } from '../UnoLogo';

export interface HeaderSettings {
    transparent?: boolean;
}

export const StyledHeader = tw.div<HeaderSettings>`
    w-full
    ${({ transparent }) => (transparent ? 'bg-transparent' : 'bg-unoblue')}
    flex
`;

const StyledNavbar = tw.div<any>`
    w-full
    max-w-unomax
    p-[20px_40px_15px]
    m-auto
    flex
    justify-between
    box-content
`;

export const NavBarTitle = tw.div<any>`
    flex
    flex-row
    items-center
    text-white
    md:[&>h2]:text-[25px]
    font-bold
    uppercase
    [&>h2]:tracking-[1.5px]
    [&>h2]:text-[35px]
    [&>h2]:leading-9
    [&>h2]:my-0
    [&>h2]:mx-[15px]
`;

export const NavBar = ({ transparent, children }: any) => (
    <StyledHeader transparent={transparent}>
        <StyledNavbar>
            <UnoLogo width={160} height={52} />
            {children}
        </StyledNavbar>
    </StyledHeader>
);
