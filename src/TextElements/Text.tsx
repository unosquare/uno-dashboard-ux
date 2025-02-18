import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: Color;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(({ color, className, children }, ref) => (
    <p
        ref={ref}
        className={unoTwMerge(
            // common
            'text-unodashboard-default',
            color
                ? getColorClassNames(color, colorPalette.text).textColor
                : unoTwMerge(
                      // light
                      'text-unodashboard-content',
                      // dark
                      'dark:text-dark-unodashboard-content',
                  ),
            className,
        )}
    >
        {children}
    </p>
));
