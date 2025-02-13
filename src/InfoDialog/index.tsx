import { Info16Regular } from '@fluentui/react-icons';
import type { PropsWithChildren } from 'react';
import { Button } from '../Button';
import { Dialog, DialogPanel } from '../Dialog';
import { useToggle } from '../hooks';

export type InfoDialogSettings = {
    closeText?: string;
    tooltip?: string;
};

export const InfoDialogTitle = ({ children }: PropsWithChildren) => (
    <h3 className='text-lg mb-2 font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong'>
        {children}
    </h3>
);

export const InfoDialog = ({
    closeText = 'Got it!',
    tooltip = 'Info',
    children,
}: PropsWithChildren<InfoDialogSettings>) => {
    const [isOpen, setIsOpen] = useToggle();

    return (
        <>
            <Button variant='light' onClick={setIsOpen} icon={Info16Regular} title={tooltip} />
            <Dialog open={isOpen} onClose={setIsOpen} static={true}>
                <DialogPanel>
                    <p className='mt-2 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>
                        {children}
                    </p>
                    <Button className='mt-8 w-full' onClick={setIsOpen}>
                        {closeText}
                    </Button>
                </DialogPanel>
            </Dialog>
        </>
    );
};
