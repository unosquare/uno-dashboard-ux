import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { HasChildrenComponent } from '../constants';

export interface AppContainerSettings extends HasChildrenComponent {
    rows: number;
    columns?: number;
    hasToolbar?: boolean;
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

const AppContainerBase = styled.div<AppContainerSettings>`
    grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
    grid-template-rows: ${({ rows }) => getTemplateRows(rows)};
`;

export const StyledAppContainer = tw(AppContainerBase)<AppContainerSettings>`
    grid
    gap-x-[35px]
    gap-y-[30px]
    auto-rows-max
    w-[calc(100%-80px)]
    max-w-unomax
    m-auto
    p-[30px]
    h-auto
    min-h-[calc(100%-70px)]
    box-content
    md:h-[unset]
    md:max-h-[unset]
    md:pb-[50px]
    md:!grid-rows-none
    md:!grid-cols-[repeat(1,1fr)]
`;

export const StyledContainer = tw.div<any>`
    w-full
    h-[calc(100vh-145px)]
    ${({ $hasToolbar }) => $hasToolbar && 'h-[calc(100vh-185px)]'}
    overflow-y-auto
`;

export const AppContainer = ({ rows, children, columns = 5, hasToolbar }: AppContainerSettings) => (
    <StyledContainer $hasToolbar={hasToolbar}>
        <StyledAppContainer rows={rows} columns={columns}>
            {children}
        </StyledAppContainer>
    </StyledContainer>
);
