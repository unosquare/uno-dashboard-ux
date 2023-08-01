import React from 'react';
import tw from 'tailwind-styled-components';
import { Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import { HasChildrenComponent } from '../constants';

export const StyledToolbar = tw.div`
    flex
    items-center
    justify-between
    whitespace-nowrap
    max-w-unomax
    m-auto
    px-[40px]
    h-14
`;

export const StyledToolbarContainer = tw.aside`
    h-14
    relative
    w-full
    bg-white
    shadow-card
    z-10
`;

export const BasicToolbar = ({ children, className }: HasChildrenComponent & { className?: string }) => (
    <StyledToolbarContainer>
        <StyledToolbar>
            <Flex className={twMerge('gap-6', className)}>
                <Flex className='gap-2' justifyContent='start'>
                    {children}
                </Flex>
            </Flex>
        </StyledToolbar>
    </StyledToolbarContainer>
);
