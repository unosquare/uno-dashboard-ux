import React, { useRef, useEffect } from 'react';
import { useInternalState } from '../hooks';
import { mergeRefs } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    defaultValue?: string | number;
    value?: string | number;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    autoHeight?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    onValueChange?: (value: any) => void;
}

const makeTextareaClassName = makeClassName('Textarea');

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            value,
            defaultValue = '',
            placeholder = 'Type...',
            error = false,
            errorMessage,
            disabled = false,
            className,
            onChange,
            onValueChange,
            autoHeight = false,
            ...other
        },
        ref,
    ) => {
        const [val, setVal] = useInternalState(defaultValue, value);

        const inputRef = useRef<HTMLTextAreaElement>(null);

        const hasSelection = hasValue(val);

        // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
        useEffect(() => {
            const textAreaHTMLRef = inputRef.current;
            if (autoHeight && textAreaHTMLRef) {
                textAreaHTMLRef.style.height = '60px';
                // Calculates the height dynamically
                const scrollHeight = textAreaHTMLRef.scrollHeight;
                textAreaHTMLRef.style.height = `${scrollHeight}px`;
            }
        }, [autoHeight, inputRef, val]);

        return (
            <>
                <textarea
                    ref={mergeRefs([inputRef, ref])}
                    value={val}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={unoTwMerge(
                        makeTextareaClassName('Textarea'),
                        // common
                        'w-full flex items-center outline-hidden rounded-unodashboard-default px-3 py-2 text-unodashboard-default focus:ring-2 transition duration-100 border',
                        // light
                        'shadow-unodashboard-input focus:border-unodashboard-brand-subtle focus:ring-unodashboard-brand-muted',
                        // dark
                        'dark:shadow-dark-unodashboard-input dark:focus:border-dark-unodashboard-brand-subtle dark:focus:ring-dark-unodashboard-brand-muted',
                        getSelectButtonColors(hasSelection, disabled, error),
                        disabled
                            ? 'placeholder:text-unodashboard-content-subtle dark:placeholder:text-dark-unodashboard-content-subtle'
                            : 'placeholder:text-unodashboard-content dark:placeholder:text-dark-unodashboard-content',
                        className,
                    )}
                    data-testid='text-area'
                    onChange={(e) => {
                        onChange?.(e);
                        setVal(e.target.value);
                        onValueChange?.(e.target.value);
                    }}
                    {...other}
                />
                {error && errorMessage ? (
                    <p className={unoTwMerge(makeTextareaClassName('errorMessage'), 'text-sm text-red-500 mt-1')}>
                        {errorMessage}
                    </p>
                ) : null}
            </>
        );
    },
);
