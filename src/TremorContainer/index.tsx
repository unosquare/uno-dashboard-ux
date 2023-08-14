import React from 'react';
import tw from 'tailwind-styled-components';
import { HasChildrenComponent } from '../constants';

export type TremorContainerSettings = HasChildrenComponent & {
    hasToolbar?: boolean;
};

const MainApp = tw.main<any>`
    w-full
    h-[calc(100vh-110px)]
    ${({ $hasToolbar }) => $hasToolbar && 'h-[calc(100vh-165px)]'}
    overflow-y-auto
    p-2`;

export const TremorContainer = ({ children, hasToolbar }: TremorContainerSettings) => (
    <MainApp $hasToolbar={hasToolbar}>
        <div className='max-w-unomax m-auto'>{children}</div>
    </MainApp>
);
