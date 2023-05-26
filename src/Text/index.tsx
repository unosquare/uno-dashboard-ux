import React from 'react';
import tw from 'tailwind-styled-components';
import { HasChildrenComponent } from '../constants';

const StyledCenteredSpan = tw.span`
    flex 
    items-center
`;

const StyledCenteredBoldSpan = tw.div`
    flex 
    items-center 
    font-bold 
    text-sm 
    pl-1 
    pb-1 
    pt-1
`;

const StyledLeftSpan = tw.div`
    flex 
    pl-1 
    text-xs
    items-start
`;

export const CenteredSpan = ({ children }: HasChildrenComponent) => <StyledCenteredSpan>{children}</StyledCenteredSpan>;

export const TooltipTitle = ({ children }: HasChildrenComponent) => (
    <StyledCenteredBoldSpan>{children}</StyledCenteredBoldSpan>
);

export const LabelInfo = ({ children }: HasChildrenComponent) => <StyledLeftSpan>{children}</StyledLeftSpan>;
