import React from 'react';
import tw from 'tailwind-styled-components';
import { HasChildrenComponent } from '../constants';

export const StyledToolbar = tw.div`
    flex
    items-center
    justify-between
    max-w-unomax
    m-auto
    px-[40px]
    h-14
`;

export const StyledToolbarSelectorContainer = tw.div`
    flex
    items-center
    gap-6
    w-7/12
    justify-start
`;

export const StyledToolbarActionContainer = tw.div`
    flex
    items-center
    gap-6
    ml-auto
    w-5/12
    justify-end
    [&>svg]:cursor-pointer
`;

export const StyledToolbarContainer = tw.aside`
    h-14
    relative
    w-full
    bg-white
    shadow-card
    z-10
`;

export const StyledSelectContainer = tw.div`
    flex
    items-center
    gap-2
    [&>span]:max-w-[100px]
    [&>span]:min-w-fit
`;

export const BasicToolbar = ({ children }: HasChildrenComponent) => (
    <StyledToolbarContainer>
        <StyledToolbar>
            <StyledToolbarSelectorContainer>
                <StyledSelectContainer>{children}</StyledSelectContainer>
            </StyledToolbarSelectorContainer>
        </StyledToolbar>
    </StyledToolbarContainer>
);
