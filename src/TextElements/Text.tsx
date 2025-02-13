import React from 'react';
import { tremorTwMerge } from '../tremorTwMerge';
import { colorPalette, getColorClassNames } from '../theme';
import type { Color } from '../constants';

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
