import React from 'react';
import tw from 'tailwind-styled-components';
import { UnoLogo } from '../UnoLogo';

export interface NavBarSettings {
    transparent?: boolean;
}

export const StyledHeader = tw.header<NavBarSettings>`
    w-full
    ${({ transparent }) => (transparent ? 'bg-transparent' : 'bg-unoblue')}
    flex
`;

const StyledNavbar = tw.nav`
    w-full
    max-w-unomax
    p-[11px_18px]
    m-auto
    flex
    justify-between
    box-content
`;

export const NavBarTitle = tw.div`
    flex
    flex-row
    items-center
    text-white
    font-bold
    [&>h2]:tracking-[1.5px]
    [&>h2]:text-3xl
    [&>h2]:leading-9
    [&>h2]:my-0
    [&>h2]:mx-[15px]
`;

export const NavBar = ({ transparent, children }: any) => (
    <StyledHeader transparent={transparent}>
        <StyledNavbar>
            <UnoLogo width={150} height={48} className='sm:hidden' />
            {children}
        </StyledNavbar>
    </StyledHeader>
);
