import React from 'react';
import styled from 'styled-components';
import { device } from '../theme';
import { UnoLogo } from '../UnoLogo';

export interface HeaderSettings {
    transparent?: boolean;
}

const StyledHeader = styled.div<HeaderSettings>`
    width: 100%;
    background-color: ${({ theme, transparent }) => (transparent ? theme.colors.background : theme.colors.main)};
`;

const StyledNavbar = styled.div`
    max-width: ${({ theme }) => theme.maxWidth};
    padding: 20px 40px 15px;
    margin: auto;
    display: flex;
    justify-content: space-between;
`;

export const NavBarTitle = styled.div`
    display: flex;
    align-items: center;
    h2 {
        color: ${({ theme }) => theme.colors.fontSecondary};
        font-size: 35px;
        font-weight: 700;
        letter-spacing: 1.5px;
        line-height: 37px;
        text-transform: uppercase;
        margin: 0px 15px;
    }
    ${device.md} {
        h2 {
            font-size: 25px;
        }
    }
`;

export const NavBar = ({ transparent, children }: any) => (
    <StyledHeader transparent={transparent}>
        <StyledNavbar>
            <UnoLogo width={160} height={52} />
            {children}
        </StyledNavbar>
    </StyledHeader>
);
