import { Dismiss16Regular } from '@fluentui/react-icons';
import { Flex } from '@tremor/react';
import type React from 'react';
import { InfoDialogTitle } from '../InfoDialog';

export const DialogHeader = ({ closeModal, children }: React.PropsWithChildren<{ closeModal: () => void }>) => (
    <Flex alignItems='center' justifyContent='between'>
        <InfoDialogTitle>{children}</InfoDialogTitle>
        <button
            type='button'
            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
            onClick={closeModal}
        >
            <Dismiss16Regular aria-label='Close modal' />
        </button>
    </Flex>
);
