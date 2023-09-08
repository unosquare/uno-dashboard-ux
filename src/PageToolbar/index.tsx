import React, { PropsWithChildren } from 'react';
import tw from 'tailwind-styled-components';
import { Flex } from '@tremor/react';
import { twMerge } from 'tailwind-merge';

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

export const BasicToolbar = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
    <aside className='h-14 relative w-full bg-tremor-background dark:bg-dark-tremor-background shadow-card z-10'>
        <StyledToolbar>
            <Flex className={twMerge('gap-6', className)}>
                <Flex className='gap-2' justifyContent='start'>
                    {children}
                </Flex>
            </Flex>
        </StyledToolbar>
    </aside>
);
