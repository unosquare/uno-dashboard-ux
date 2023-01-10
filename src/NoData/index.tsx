import React from 'react';
import tw from 'tailwind-styled-components';
import { CloudDismiss48Regular } from '@fluentui/react-icons';

const StyledContainer = tw.div`
    flex
    justify-center
    items-center
    flex-col
    h-full
`;

export const NoDataHeader = tw.h6`
    text-base
    text-maingray
    text-center
    m-2
`;

const DefaultLegend = () => (
    <>
        <NoDataHeader>This information is not ready yet</NoDataHeader>
        <NoDataHeader>Please check again later</NoDataHeader>
    </>
);

export const NoData = ({ children }: any) => (
    <StyledContainer>
        <CloudDismiss48Regular primaryFill='#505050' />
        {children || <DefaultLegend />}
    </StyledContainer>
);
