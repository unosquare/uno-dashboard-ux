import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';

export interface AppContainerSettings {
    rows: number;
    columns?: number;
    children: React.ReactNode;
}

const AppContainerBase = styled.div<AppContainerSettings>`
    grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
    grid-template-rows: repeat(${({ rows }) => rows}, 1fr);
`;

export const StyledAppContainer = tw(AppContainerBase)<AppContainerSettings>`
    grid
    gap-x-[35px]
    gap-y-[30px]
    auto-rows-max
    w-[calc(100%-80px)]
    max-w-unomax
    m-auto
    p-7
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
    overflow-y-auto
    scrollbar-stable
`;

export const AppContainer = ({ rows, children, columns = 5 }: AppContainerSettings) => (
    <StyledContainer>
        <StyledAppContainer rows={rows} columns={columns}>
            {children}
        </StyledAppContainer>
    </StyledContainer>
);
