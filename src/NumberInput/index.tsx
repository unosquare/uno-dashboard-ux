import React, { useRef } from 'react';
import { BaseInput, type BaseInputProps } from '../BaseInput';
import { mergeRefs } from '../reactUtils';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const MinusIcon = ({ ...props }) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2.5'
    >
        <title>Minus</title>
        <path d='M20 12H4' />
    </svg>
);

const PlusIcon = ({ ...props }) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2.5'
    >
        <title>Plus</title>
        <path d='M12 4v16m8-8H4' />
    </svg>
);

export interface NumberInputProps extends Omit<BaseInputProps, 'type' | 'stepper' | 'onSubmit' | 'makeInputClassName'> {
    step?: string | number;
    enableStepper?: boolean;
    onSubmit?: (value: number) => void;
    onValueChange?: (value: number) => void;
}

const baseArrowClasses = 'flex mx-auto text-unodashboard-content-subtle dark:text-dark-unodashboard-content-subtle';

const enabledArrowClasses = 'cursor-pointer hover:text-unodashboard-content dark:hover:text-dark-unodashboard-content';

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
    const { onSubmit, enableStepper = true, disabled, onValueChange, onChange, ...other } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [isArrowDownPressed, setIsArrowDownPressed] = React.useState(false);
    const handleArrowDownPress = React.useCallback(() => {
        setIsArrowDownPressed(true);
    }, []);
    const handleArrowDownRelease = React.useCallback(() => {
        setIsArrowDownPressed(false);
    }, []);

    const [isArrowUpPressed, setIsArrowUpPressed] = React.useState(false);
    const handleArrowUpPress = React.useCallback(() => {
        setIsArrowUpPressed(true);
    }, []);
    const handleArrowUpRelease = React.useCallback(() => {
        setIsArrowUpPressed(false);
    }, []);

    return (
        <BaseInput
            type='number'
            ref={mergeRefs([inputRef, ref])}
            disabled={disabled}
            makeInputClassName={makeClassName('NumberInput')}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                    const value = inputRef.current?.value;
                    onSubmit?.(Number.parseFloat(value ?? ''));
                }
                if (e.key === 'ArrowDown') {
                    handleArrowDownPress();
                }
                if (e.key === 'ArrowUp') {
                    handleArrowUpPress();
                }
            }}
            onKeyUp={(e) => {
                if (e.key === 'ArrowDown') {
                    handleArrowDownRelease();
                }
                if (e.key === 'ArrowUp') {
                    handleArrowUpRelease();
                }
            }}
            onChange={(e) => {
                if (disabled) return;

                onValueChange?.(Number.parseFloat(e.target.value));
                onChange?.(e);
            }}
            stepper={
                enableStepper ? (
                    <div className={unoTwMerge('flex justify-center align-middle')}>
                        <div
                            tabIndex={-1}
                            onClick={(e) => e.preventDefault()}
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => {
                                if (e.cancelable) {
                                    e.preventDefault();
                                }
                            }}
                            onMouseUp={() => {
                                if (disabled) return;
                                inputRef.current?.stepDown();
                                inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
                            }}
                            className={unoTwMerge(
                                !disabled && enabledArrowClasses,
                                baseArrowClasses,
                                'group py-[10px] px-2.5 border-l border-unodashboard-border dark:border-dark-unodashboard-border',
                            )}
                        >
                            <MinusIcon
                                data-testid='step-down'
                                className={`${
                                    isArrowDownPressed ? 'scale-95' : ''
                                } h-4 w-4 duration-75 transition group-active:scale-95`}
                            />
                        </div>
                        <div
                            tabIndex={-1}
                            onClick={(e) => e.preventDefault()}
                            onMouseDown={(e) => e.preventDefault()}
                            onTouchStart={(e) => {
                                if (e.cancelable) {
                                    e.preventDefault();
                                }
                            }}
                            onMouseUp={() => {
                                if (disabled) return;
                                inputRef.current?.stepUp();
                                inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
                            }}
                            className={unoTwMerge(
                                !disabled && enabledArrowClasses,
                                baseArrowClasses,
                                'group py-[10px] px-2.5 border-l border-unodashboard-border dark:border-dark-unodashboard-border',
                            )}
                        >
                            <PlusIcon
                                data-testid='step-up'
                                className={`${
                                    isArrowUpPressed ? 'scale-95' : ''
                                } h-4 w-4 duration-75 transition group-active:scale-95`}
                            />
                        </div>
                    </div>
                ) : null
            }
            {...other}
        />
    );
});
