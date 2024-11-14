import { CloudDismiss48Regular } from '@fluentui/react-icons';
import { Bold, Flex } from '@tremor/react';
import React, { type PropsWithChildren } from 'react';

export const NoData = ({ children }: PropsWithChildren) => (
    <Flex className='mt-5 p-4' justifyContent='center' alignItems='center' flexDirection='col'>
        <CloudDismiss48Regular primaryFill='#505050' />
        {children ?? <Bold className='mt-3'>No record found</Bold>}
    </Flex>
);
