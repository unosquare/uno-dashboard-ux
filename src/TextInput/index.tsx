import React from 'react';
import { BaseInput, type BaseInputProps } from '../BaseInput';
import { makeClassName } from '../theme';

export type TextInputProps = Omit<BaseInputProps, 'stepper' | 'makeInputClassName'> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    icon?: React.ElementType | React.JSXElementConstructor<any>;
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
};

const makeTextInputClassName = makeClassName('TextInput');

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(({ type = 'text', ...other }, ref) => (
    <BaseInput ref={ref} type={type} makeInputClassName={makeTextInputClassName} {...other} />
));
