import React from 'react';
import styled from 'styled-components';
import { device } from '../theme';

export interface AppContainerSettings {
    rows: number;
    columns?: number;
    children: React.ReactNode;
}

const getTemplateRows = (rows: number) => {
    switch (rows) {
        case 5:
            return 'repeat(5, 18%)';
        case 4:
            return 'repeat(4, 23%)';
        case 3:
            return 'repeat(3, 31%)';
        case 2:
            return 'repeat(2, 46.5%)';
        default:
            return '';
    }
};

const StyledAppContainer = styled.div<AppContainerSettings>`
    display: grid;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
    grid-column-gap: 35px;
    grid-template-rows: ${({ rows }) => getTemplateRows(rows)};
    grid-row-gap: ${({ rows }) => (rows === 5 ? '35px' : '30px')};
    width: calc(100% - 80px);
    max-width: ${(props) => props.theme.maxWidth};
    margin: auto;
    padding: 30px;
    min-height: calc(100% - 70px);
    height: auto;
    ${device.md} {
        height: unset;
        max-height: unset;
        padding-bottom: 50px;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: none;
    }
`;

const StyledAppContainerScroll = styled.div`
    height: calc(100vh - 145px);
    width: 100%;
    overflow-y: auto;
`;

export const AppContainer = ({ rows, children, columns = 5 }: AppContainerSettings) => (
    <StyledAppContainerScroll>
        <StyledAppContainer rows={rows} columns={columns}>
            {children}
        </StyledAppContainer>
    </StyledAppContainerScroll>
);
