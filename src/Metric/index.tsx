import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

export interface MetricProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: Color;
}

export const Metric = React.forwardRef<HTMLParagraphElement, MetricProps>((props, ref) => {
    const { color, children, className, ...other } = props;
    return (
        <p
            ref={ref}
            className={tremorTwMerge(
                'font-semibold text-tremor-metric',
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
