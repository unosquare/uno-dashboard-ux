import type { PropsWithChildren } from 'react';
import tw from 'tailwind-styled-components';

const MainApp = tw.main<{ $hasToolbar?: boolean }>`
    w-full
    bg-[#f1f2f3]
    dark:bg-[#3D4A66]
    ${({ $hasToolbar }) => ($hasToolbar ? 'h-[calc(100vh-165px)]' : 'h-[calc(100vh-110px)]')}
    overflow-y-auto
    p-2`;

export const UnoContainer = ({ children, hasToolbar }: PropsWithChildren<{ hasToolbar?: boolean }>) => (
    <MainApp $hasToolbar={hasToolbar}>
        <div className='max-w-[1460px] m-auto'>{children}</div>
    </MainApp>
);
