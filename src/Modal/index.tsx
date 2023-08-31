import { Dismiss20Regular } from '@fluentui/react-icons';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Flex } from '@tremor/react';
import tw from 'tailwind-styled-components';
import { Blur } from '../Blur';

export interface ModalSettings extends React.HTMLAttributes<HTMLDivElement> {
    onClose: () => void;
}

export const StyledModalContainer = tw.div`
    fixed
    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    bg-tremor-background
    dark:bg-dark-tremor-background
    rounded-tremor-default
    z-50
    flex
    flex-col
    px-4
    pb-11
    pt-3
`;

export const Modal = ({ children, className, onClose }: ModalSettings) => {
    useEffect(() => {
        document.body.classList.add('overflow-hidden');

        return () => document.body.classList.remove('overflow-hidden');
    }, []);

    const modal = (
        <>
            <StyledModalContainer className={className}>
                <Flex justifyContent='end' className='w-full'>
                    <Dismiss20Regular primaryFill='#6b7280' className='cursor-pointer' onClick={onClose} />
                </Flex>
                {children}
            </StyledModalContainer>
            <Blur onClick={onClose} />
        </>
    );

    return ReactDOM.createPortal(modal, document.body);
};
