import React, { useRef, useEffect } from 'react';
import { useInternalState } from '../hooks';
import { mergeRefs } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    const {
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
    } = props;
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
                className={tremorTwMerge(
                    makeTextareaClassName('Textarea'),
                    // common
                    'w-full flex items-center outline-none rounded-tremor-default px-3 py-2 text-tremor-default focus:ring-2 transition duration-100 border',
                    // light
                    'shadow-tremor-input focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
                    // dark
                    'dark:shadow-dark-tremor-input focus:dark:border-dark-tremor-brand-subtle focus:dark:ring-dark-tremor-brand-muted',
                    getSelectButtonColors(hasSelection, disabled, error),
                    disabled
                        ? 'placeholder:text-tremor-content-subtle dark:placeholder:text-dark-tremor-content-subtle'
                        : 'placeholder:text-tremor-content dark:placeholder:text-dark-tremor-content',
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
                <p className={tremorTwMerge(makeTextareaClassName('errorMessage'), 'text-sm text-red-500 mt-1')}>
                    {errorMessage}
                </p>
            ) : null}
        </>
    );
});
