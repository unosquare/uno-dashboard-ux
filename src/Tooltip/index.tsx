import type { PropsWithChildren } from 'react';
import { Tooltip } from 'react-tooltip';
import tw from 'tailwind-styled-components';

export interface BasicTooltipProps {
    id: string;
    float?: boolean;
}

export const TooltipContainer = tw.div`
    absolute
    z-1
    [&>div]:p-[8px]
    [&>div]:border
    [&>div]:rounded-sm
    [&>div]:bg-tremor-background 
    dark:[&>div]:bg-dark-tremor-background
    [&>div]:opacity-95
    [&>div]:text-tremor-content 
    dark:[&>div]:text-dark-tremor-content
    [&>div]:text-xs
    top-0
    left-0
`;

export const BasicTooltip = ({ id, children, float }: PropsWithChildren<BasicTooltipProps>) => (
    <TooltipContainer>
        <Tooltip id={id} float={float}>
            {children}
        </Tooltip>
    </TooltipContainer>
);
