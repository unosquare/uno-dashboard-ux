import React, { ReactNode } from 'react';
import { Checkmark28Regular, Dismiss28Regular } from '@fluentui/react-icons';
import useAlertStore from '../useAlertStore';
import { createPortal } from 'react-dom';

const AUTO_ANIMATE = ' animate-[slideInTop_4s_ease-out_forwards] ';

const StyledContainer = ({
    children,
    animation,
    ereaseAlert,
}: {
    children: ReactNode;
    animation: string;
    ereaseAlert: () => void;
}) => (
    <div
        className={`
    shadow-alert
    font-sans
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
    ${animation}
    z-40
    [&_svg]:mr-2
    [&_svg]:ml-[14px]
    [&_svg]:min-w-[28px]
    [&>p]:max-w-full
    [&>p]:m-0
    mb-3
`}
        onClick={ereaseAlert}
    >
        {children}
    </div>
);

type AlertProps = {
    message?: string;
    animation: string;
    deleteAlert: () => void;
    icon: ReactNode;
};

const AlertComponent = ({ message, animation, deleteAlert, icon }: AlertProps) => {
    if (animation === AUTO_ANIMATE)
        setTimeout(() => {
            deleteAlert();
        }, 4500);
    return (
        <StyledContainer animation={animation} ereaseAlert={animation === AUTO_ANIMATE ? () => {} : deleteAlert}>
            {icon}
            {message}
        </StyledContainer>
    );
};

export const Alert = () => {
    const [activeAlerts, deleteAlerts] = useAlertStore((state) => [state.activeAlerts, state.deleteAlerts]);

    const animationElection = (isTimed: boolean): string =>
        isTimed ? AUTO_ANIMATE : ' animate-[fadeIn_0.5s_ease-out_forwards] hover:bg-gray-400 ';

    return createPortal(
        <div className='flex flex-col absolute top-6 right-7 gap-1'>
            {activeAlerts.map((alert) => (
                <AlertComponent
                    message={
                        alert.isSuccess
                            ? alert.message || 'Changes Saved Successfully'
                            : alert.message || 'Something Went Wrong'
                    }
                    animation={animationElection(alert.isTimed)}
                    key={alert.id}
                    deleteAlert={() => deleteAlerts(alert.id)}
                    icon={
                        alert.isSuccess ? (
                            <Checkmark28Regular primaryFill='#1d910c' />
                        ) : (
                            <Dismiss28Regular primaryFill='#e72727' />
                        )
                    }
                />
            ))}
            <p></p>
        </div>,
        document.body,
    );
};
