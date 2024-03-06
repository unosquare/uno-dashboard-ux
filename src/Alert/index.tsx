import React, { useEffect, useState } from 'react';
import { Checkmark28Regular, Dismiss28Regular } from '@fluentui/react-icons';
import tw from 'tailwind-styled-components';
import useAlertStore from '../useAlertStore';
import { createPortal } from 'react-dom';

const StyledContainer = tw.div`
    shadow-alert
    font-sans
    absolute
    top-6
    right-7
    min-h-[61px]
    min-w-[288px]
    max-w-[320px]
    pr-1
    bg-tremor-background 
    dark:bg-dark-tremor-background
    rounded
    flex
    justify-center
    items-center
    text-lg
    invisible
    animate-[slideInTop_4s_ease-out_forwards]
    z-40
    [&_svg]:mr-2
    [&_svg]:ml-[14px]
    [&_svg]:min-w-[28px]
    [&>p]:max-w-full
    [&>p]:m-0
`;

type AlertProps = {
    message?: string;
};

const AlertSuccess = ({ message = 'Changes Saved Successfully' }: AlertProps) => (
    <StyledContainer>
        <Checkmark28Regular primaryFill='#1d910c' />
        {message}
    </StyledContainer>
);

const AlertError = ({ message = 'Something Went Wrong' }: AlertProps) => (
    <StyledContainer>
        <Dismiss28Regular primaryFill='#e72727' />
        {message}
    </StyledContainer>
);

export const Alert = () => {
    const [isSuccess, message] = useAlertStore((state) => [state.isSuccess, state.message]);
    const [isSuccessLocal, setIsSuccess] = useState<boolean | undefined>(false);
    const [messageLocal, setMessage] = useState<string | undefined>('');

    useEffect(()  => {
        setIsSuccess(isSuccess);
        setMessage(message);
    },[message, isSuccess]);

    return (
        // <>
        //     {isSuccess && <AlertSuccess message={message} />}
        //     {isSuccess === false && <AlertError message={message} />}
        // </>
        createPortal(isSuccessLocal 
            ? <AlertSuccess message={messageLocal} /> 
            : <AlertError message={messageLocal} />, document.body)
    );

    
};
