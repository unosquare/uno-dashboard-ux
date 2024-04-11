import React from 'react';
import { Info16Regular } from '@fluentui/react-icons';
import { Button, Dialog, DialogPanel } from '@tremor/react';

export type InfoDialogSettings = {
    closeText?: string;
    children?: React.ReactNode;
};

export const InfoDialog = ({ closeText = 'Got it!', children }: InfoDialogSettings) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button variant='light' onClick={() => setIsOpen(true)} icon={Info16Regular} />
            <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
                <DialogPanel>
                    <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
                        {children}
                    </p>
                    <Button className='mt-8 w-full' onClick={() => setIsOpen(false)}>
                        {closeText}
                    </Button>
                </DialogPanel>
            </Dialog>
        </>
    );
};
