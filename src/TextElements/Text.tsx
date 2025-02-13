import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: Color;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
    const { color, className, children } = props;
    return (
        <p
            ref={ref}
            className={tremorTwMerge(
                // common
                'text-tremor-default',
                color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : tremorTwMerge(
                          // light
                          'text-tremor-content',
                          // dark
                          'dark:text-dark-tremor-content',
                      ),
                className,
            )}
        >
            {children}
        </p>
    );
});
