import React from 'react';
import tw from 'tailwind-styled-components';
import { CloudDismiss48Regular } from '@fluentui/react-icons';
import { Flex } from '@tremor/react';

export const NoDataHeader = tw.h6`
    text-base
    text-maingray
    text-center
    m-2
`;

export const NoData = ({ children }: any) => (
    <Flex className='mt-5' justifyContent='center' alignItems='center'>
        <CloudDismiss48Regular primaryFill='#505050' />
        {children || <NoDataHeader>No record found</NoDataHeader>}
    </Flex>
);
