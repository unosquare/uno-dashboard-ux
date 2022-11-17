import React from "react";
import styled from "styled-components";

export interface HeaderSettings {
  transparent?: boolean;
}

const StyledHeader = styled.div<HeaderSettings>`
  width: 100%;
  background-color: ${({ theme, transparent }) =>
    transparent ? theme.colors.background : theme.colors.main};
`;

const StyledNavbar = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  padding: 20px 40px 15px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  img {
    width: 160px;
    height: 52px;
  }
`;

export const NavBar = ({ transparent, img, children }: any) => (
  <StyledHeader transparent={transparent}>
    <StyledNavbar>
      <img src={img} alt="Unosquare Logo" />
      {children}
    </StyledNavbar>
  </StyledHeader>
);
