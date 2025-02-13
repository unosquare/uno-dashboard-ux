import {
    DialogBackdrop,
    Dialog as HeadlessuiDialog,
    DialogPanel as HeadlessuiDialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeDisplayClassName = makeClassName('dialog');

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
    open: boolean;
    onClose: (val: boolean) => void;
    role?: 'dialog' | 'alertdialog';
} & XOR<{ unmount?: boolean }, { static?: boolean }>;

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(({ children, className, open, ...other }, ref) => (
    <Transition appear show={open}>
        <HeadlessuiDialog
            ref={ref}
            {...other}
            className={tremorTwMerge(makeDisplayClassName('root'), 'relative z-50', className)}
        >
            <DialogBackdrop className='fixed bg-slate-950/30  dark:bg-slate-950/50  inset-0  transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in' />
            <div className='fixed inset-0 overflow-y-auto w-screen'>
                <div className='flex min-h-full items-center justify-center p-4'>{children}</div>
            </div>
        </HeadlessuiDialog>
    </Transition>
));

export type DialogPanelProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogPanel = React.forwardRef<HTMLDivElement, DialogPanelProps>(
    ({ children, className, ...other }, ref) => (
        <TransitionChild
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
        >
            <HeadlessuiDialogPanel
                ref={ref}
                className={tremorTwMerge(
                    makeDisplayClassName('panel'),
                    // common
                    'w-full max-w-lg overflow-visible text-left ring-1 shadow-tremor transition-all transform',
                    // light
                    'bg-tremor-background  text-tremor-content ring-tremor-ring',
                    // dark
                    'dark:bg-dark-tremor-background dark:text-dark-tremor-content dark:ring-dark-tremor-ring',
                    'rounded-tremor-default p-6',
                    className,
                )}
                {...other}
            >
                {children}
            </HeadlessuiDialogPanel>
        </TransitionChild>
    ),
);
