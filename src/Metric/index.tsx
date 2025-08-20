import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

export interface MetricProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: Color;
    onClick?: () => void;
}

export const Metric = React.forwardRef<HTMLParagraphElement, MetricProps>(
    ({ color, children, className, onClick, ...other }, ref) => (
        <p
            ref={ref}
            className={unoTwMerge(
                'font-semibold text-unodashboard-metric',
                color
                    ? getColorClassNames(color, colorPalette.darkText).textColor
                    : 'text-unodashboard-content-strong dark:text-dark-unodashboard-content-strong',
                onClick && 'cursor-pointer',
                className,
            )}
            onClick={onClick}
            {...other}
        >
            {children}
        </p>
    ),
);
