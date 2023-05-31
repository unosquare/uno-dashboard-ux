import React from 'react';
import tw from 'tailwind-styled-components';
import { HasChildrenComponent } from '../constants';

export interface TremorContainerSettings extends HasChildrenComponent {
    hasToolbar?: boolean;
}

const MainApp = tw.main<any>`
    w-full
    h-[calc(100vh-145px)]
    ${({ $hasToolbar }) => $hasToolbar && 'h-[calc(100vh-185px)]'}
    overflow-y-auto
    p-2`;

const InnerMain = tw.div`
    max-w-unomax
    m-auto`;

export const TremorContainer = ({ children, hasToolbar }: TremorContainerSettings) => (
    <MainApp $hasToolbar={hasToolbar}>
        <InnerMain>{children}</InnerMain>
    </MainApp>
);
