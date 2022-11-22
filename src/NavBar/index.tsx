import React from 'react';
import styled from 'styled-components';
import { device } from '../theme';

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

const StyledImg = styled.img`
    width: 160px;
    height: 52px;
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

export const NavBar = ({ transparent, img, children }: any) => (
    <StyledHeader transparent={transparent}>
        <StyledNavbar>
            <StyledImg src={img} alt='Unosquare Logo' />
            {children}
        </StyledNavbar>
    </StyledHeader>
);
