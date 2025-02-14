import { Disclosure } from '@headlessui/react';
import React, { createContext, useContext } from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const ArrowUpHeadIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Up</title>
        <path d='M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z' />
    </svg>
);

const makeAccordionListClassName = makeClassName('AccordionList');

export interface AccordionListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactElement[] | React.ReactElement;
}

const RootStylesContext = createContext<string | undefined>(undefined);

export const AccordionList = React.forwardRef<HTMLDivElement, AccordionListProps>(
    ({ children, className, ...other }, ref) => {
        const numChildren = React.Children.count(children);

        return (
            <div
                ref={ref}
                className={tremorTwMerge(
                    makeAccordionListClassName('root'),
                    // common
                    'rounded-tremor-default',
                    // light
                    'shadow-tremor-card',
                    // dark
                    'dark:shadow-dark-tremor-card',
                    className,
                )}
                {...other}
            >
                {React.Children.map(children, (child, idx) => {
                    if (idx === 0) {
                        return (
                            <RootStylesContext.Provider value={tremorTwMerge('rounded-t-tremor-default border')}>
                                {React.cloneElement(child)}
                            </RootStylesContext.Provider>
                        );
                    }
                    if (idx === numChildren - 1) {
                        return (
                            <RootStylesContext.Provider
                                value={tremorTwMerge('rounded-b-tremor-default border-l border-r border-b')}
                            >
                                {React.cloneElement(child)}
                            </RootStylesContext.Provider>
                        );
                    }
                    return (
                        <RootStylesContext.Provider value={tremorTwMerge('border-l border-r border-b')}>
                            {React.cloneElement(child)}
                        </RootStylesContext.Provider>
                    );
                })}
            </div>
        );
    },
);

const makeAccordionHeaderClassName = makeClassName('AccordionHeader');

export const AccordionHeader = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, className, ...other }, ref) => {
        const { isOpen } = useContext(OpenContext);

        return (
            <Disclosure.Button
                ref={ref}
                className={tremorTwMerge(
                    makeAccordionHeaderClassName('root'),
                    // common
                    'w-full flex items-center justify-between px-4 py-3',
                    // light
                    'text-tremor-content-emphasis',
                    // dark
                    'dark:text-dark-tremor-content-emphasis',
                    className,
                )}
                {...other}
            >
                <div
                    className={tremorTwMerge(makeAccordionHeaderClassName('children'), 'flex flex-1 text-inherit mr-4')}
                >
                    {children}
                </div>
                <div>
                    <ArrowUpHeadIcon
                        className={tremorTwMerge(
                            makeAccordionHeaderClassName('arrowIcon'),
                            //common
                            'h-5 w-5 -mr-1',
                            // light
                            'text-tremor-content-subtle',
                            // dark
                            'dark:text-dark-tremor-content-subtle',
                            isOpen ? 'transition-all' : 'transition-all -rotate-180',
                        )}
                    />
                </div>
            </Disclosure.Button>
        );
    },
);

const makeAccordionBodyClassName = makeClassName('AccordionBody');

export const AccordionBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...other }, ref) => (
        <Disclosure.Panel
            ref={ref}
            className={tremorTwMerge(
                makeAccordionBodyClassName('root'),
                // common
                'w-full text-tremor-default px-4 pb-3',
                // light
                'text-tremor-content',
                // dark
                'dark:text-dark-tremor-content',
                className,
            )}
            {...other}
        >
            {children}
        </Disclosure.Panel>
    ),
);

const makeAccordionClassName = makeClassName('Accordion');

interface OpenContextValue {
    isOpen: boolean;
}
export const OpenContext = createContext<OpenContextValue>({
    isOpen: false,
});

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultOpen?: boolean;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
    ({ defaultOpen = false, children, className, ...other }, ref) => {
        const rootStyles = useContext(RootStylesContext) ?? tremorTwMerge('rounded-tremor-default border');

        return (
            <Disclosure
                as='div'
                ref={ref}
                className={tremorTwMerge(
                    makeAccordionClassName('root'),
                    // common
                    'overflow-hidden',
                    // light
                    'bg-tremor-background border-tremor-border',
                    // dark
                    'dark:bg-dark-tremor-background dark:border-dark-tremor-border',
                    rootStyles,
                    className,
                )}
                defaultOpen={defaultOpen}
                {...other}
            >
                {({ open }) => <OpenContext.Provider value={{ isOpen: open }}>{children}</OpenContext.Provider>}
            </Disclosure>
        );
    },
);
