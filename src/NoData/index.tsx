import { CloudDismiss48Regular } from '@fluentui/react-icons';
import type { PropsWithChildren } from 'react';
import { Flex } from '../Flex';
import { Text } from '../TextElements';

export const NoData = ({ children }: PropsWithChildren) => (
    <Flex className='mt-5 p-4' justifyContent='center' alignItems='center' flexDirection='col'>
        <CloudDismiss48Regular primaryFill='#505050' />
        {children ?? <Text className='mt-3 font-medium'>No record found</Text>}
    </Flex>
);
