import React, { type ReactNode, useState, useRef } from 'react';
import { mergeRefs } from '../reactUtils';
import { getSelectButtonColors, hasValue } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const ExclamationFilledIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Exclamation</title>
        <path d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z' />
    </svg>
);

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: 'text' | 'email' | 'url' | 'number' | 'search' | 'tel';
    defaultValue?: string | number;
    value?: string | number;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon?: React.ElementType | React.JSXElementConstructor<any>;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    stepper?: ReactNode;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onValueChange?: (value: any) => void;
    makeInputClassName: (className: string) => string;
    pattern?: string;
}

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
    (
        {
            value,
            defaultValue,
            type,
            placeholder = 'Type...',
            icon,
            error = false,
            errorMessage,
            disabled = false,
            stepper,
            makeInputClassName,
            className,
            onChange,
            onValueChange,
            autoFocus,
            pattern,
            ...other
        },
        ref,
    ) => {
        const [isFocused, setIsFocused] = useState(autoFocus || false);

        const Icon = icon;

        const inputRef = useRef<HTMLInputElement>(null);

        const hasSelection = hasValue(value || defaultValue);

        React.useEffect(() => {
            const handleFocus = () => setIsFocused(true);
            const handleBlur = () => setIsFocused(false);

            const node = inputRef.current;
            if (node) {
                node.addEventListener('focus', handleFocus);
                node.addEventListener('blur-sm', handleBlur);

                // Autofocus logic
                if (autoFocus) {
                    node.focus();
                }
            }

            return () => {
                if (node) {
                    node.removeEventListener('focus', handleFocus);
                    node.removeEventListener('blur-sm', handleBlur);
                }
            };
        }, [autoFocus]);

        return (
            <>
                <div
                    className={unoTwMerge(
                        makeInputClassName('root'),
                        // common
                        'relative w-full flex items-center min-w-[10rem] outline-hidden rounded-unodashboard-default transition duration-100 border',
                        // light
                        'shadow-unodashboard-input',
                        // dark
                        'dark:shadow-dark-unodashboard-input',
                        getSelectButtonColors(hasSelection, disabled, error),
                        isFocused &&
                            unoTwMerge(
                                // common
                                'ring-2',
                                // light
                                'border-unodashboard-brand-subtle ring-unodashboard-brand-muted',
                                // light
                                'dark:border-dark-unodashboard-brand-subtle dark:ring-dark-unodashboard-brand-muted',
                            ),
                        className,
                    )}
                >
                    {Icon ? (
                        <Icon
                            className={unoTwMerge(
                                makeInputClassName('icon'),
                                // common
                                'shrink-0 h-5 w-5 mx-2.5 absolute left-0 flex items-center',
                                // light
                                'text-unodashboard-content-subtle',
                                // light
                                'dark:text-dark-unodashboard-content-subtle',
                            )}
                        />
                    ) : null}
                    <input
                        ref={mergeRefs([inputRef, ref])}
                        defaultValue={defaultValue}
                        value={value}
                        type={type}
                        className={unoTwMerge(
                            makeInputClassName('input'),
                            // common
                            'w-full bg-transparent focus:outline-hidden focus:ring-0 border-none text-unodashboard-default rounded-unodashboard-default transition duration-100 py-2',
                            // light
                            'text-unodashboard-content-emphasis',
                            // dark
                            'dark:text-dark-unodashboard-content-emphasis',
                            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                            error ? 'pr-8' : 'pr-3',
                            Icon ? 'pl-10' : 'pl-3',
                            disabled
                                ? 'placeholder:text-unodashboard-content-subtle dark:placeholder:text-dark-unodashboard-content-subtle'
                                : 'placeholder:text-unodashboard-content dark:placeholder:text-dark-unodashboard-content',
                        )}
                        placeholder={placeholder}
                        disabled={disabled}
                        data-testid='base-input'
                        onChange={(e) => {
                            onChange?.(e);
                            onValueChange?.(e.target.value);
                        }}
                        pattern={pattern}
                        {...other}
                    />
                    {error ? (
                        <ExclamationFilledIcon
                            className={unoTwMerge(
                                makeInputClassName('errorIcon'),
                                'text-red-500 shrink-0 h-5 w-5 absolute right-0 flex items-center',
                                type === 'number' ? (stepper ? 'mr-20' : 'mr-3') : 'mx-2.5',
                            )}
                        />
                    ) : null}
                    {stepper ?? null}
                </div>
                {error && errorMessage ? (
                    <p className={unoTwMerge(makeInputClassName('errorMessage'), 'text-sm text-red-500 mt-1')}>
                        {errorMessage}
                    </p>
                ) : null}
            </>
        );
    },
);
