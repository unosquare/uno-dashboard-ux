import React from 'react';
import { BaseInput, type BaseInputProps } from '../BaseInput';
import { makeClassName } from '../theme';

export type TextInputProps = Omit<BaseInputProps, 'stepper' | 'makeInputClassName'> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon?: React.ElementType | React.JSXElementConstructor<any>;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
};

const makeTextInputClassName = makeClassName('TextInput');

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const { type = 'text', ...other } = props;
    return <BaseInput ref={ref} type={type} makeInputClassName={makeTextInputClassName} {...other} />;
});
