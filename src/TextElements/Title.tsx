import React from 'react';
import { tremorTwMerge } from '../tremorTwMerge';
import { colorPalette, getColorClassNames } from '../theme';
import type { Color } from '../constants';

export interface TitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: Color;
}

export const Title = React.forwardRef<HTMLParagraphElement, TitleProps>((props, ref) => {
    const { color, children, className, ...other } = props;
    return (
        <p
            ref={ref}
            className={tremorTwMerge(
                // common
                'font-medium text-tremor-title',
                color
                    ? getColorClassNames(color, colorPalette.darkText).textColor
                    : 'text-tremor-content-strong dark:text-dark-tremor-content-strong',
                className,
            )}
            {...other}
        >
            {children}
        </p>
    );
});
