import React, { type ReactNode, useState, useRef } from 'react';
import { hasValue, getSelectButtonColors } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';
import { mergeRefs } from '../reactUtils';

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

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
    const {
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
    } = props;
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
            node.addEventListener('blur', handleBlur);

            // Autofocus logic
            if (autoFocus) {
                node.focus();
            }
        }

        return () => {
            if (node) {
                node.removeEventListener('focus', handleFocus);
                node.removeEventListener('blur', handleBlur);
            }
        };
    }, [autoFocus]);

    return (
        <>
            <div
                className={tremorTwMerge(
                    makeInputClassName('root'),
                    // common
                    'relative w-full flex items-center min-w-[10rem] outline-none rounded-tremor-default transition duration-100 border',
                    // light
                    'shadow-tremor-input',
                    // dark
                    'dark:shadow-dark-tremor-input',
                    getSelectButtonColors(hasSelection, disabled, error),
                    isFocused &&
                        tremorTwMerge(
                            // common
                            'ring-2',
                            // light
                            'border-tremor-brand-subtle ring-tremor-brand-muted',
                            // light
                            'dark:border-dark-tremor-brand-subtle dark:ring-dark-tremor-brand-muted',
                        ),
                    className,
                )}
            >
                {Icon ? (
                    <Icon
                        className={tremorTwMerge(
                            makeInputClassName('icon'),
                            // common
                            'shrink-0 h-5 w-5 mx-2.5 absolute left-0 flex items-center',
                            // light
                            'text-tremor-content-subtle',
                            // light
                            'dark:text-dark-tremor-content-subtle',
                        )}
                    />
                ) : null}
                <input
                    ref={mergeRefs([inputRef, ref])}
                    defaultValue={defaultValue}
                    value={value}
                    type={type}
                    className={tremorTwMerge(
                        makeInputClassName('input'),
                        // common
                        'w-full bg-transparent focus:outline-none focus:ring-0 border-none text-tremor-default rounded-tremor-default transition duration-100 py-2',
                        // light
                        'text-tremor-content-emphasis',
                        // dark
                        'dark:text-dark-tremor-content-emphasis',
                        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                        error ? 'pr-8' : 'pr-3',
                        Icon ? 'pl-10' : 'pl-3',
                        disabled
                            ? 'placeholder:text-tremor-content-subtle dark:placeholder:text-dark-tremor-content-subtle'
                            : 'placeholder:text-tremor-content dark:placeholder:text-dark-tremor-content',
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
                        className={tremorTwMerge(
                            makeInputClassName('errorIcon'),
                            'text-red-500 shrink-0 h-5 w-5 absolute right-0 flex items-center',
                            type === 'number' ? (stepper ? 'mr-20' : 'mr-3') : 'mx-2.5',
                        )}
                    />
                ) : null}
                {stepper ?? null}
            </div>
            {error && errorMessage ? (
                <p className={tremorTwMerge(makeInputClassName('errorMessage'), 'text-sm text-red-500 mt-1')}>
                    {errorMessage}
                </p>
            ) : null}
        </>
    );
});
