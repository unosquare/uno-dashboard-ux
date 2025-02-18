import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeProgressBarClassName = makeClassName('ProgressBar');

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    label?: string;
    showAnimation?: boolean;
    color?: Color;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ value, label, color, showAnimation = false, className, ...other }, ref) => (
        <div
            ref={ref}
            className={unoTwMerge(makeProgressBarClassName('root'), 'flex items-center w-full', className)}
            {...other}
        >
            <div
                className={unoTwMerge(
                    makeProgressBarClassName('progressBarWrapper'),
                    'relative flex items-center w-full rounded-unodashboard-full bg-opacity-20 h-2',
                    color
                        ? getColorClassNames(color, colorPalette.background).bgColor
                        : 'bg-unodashboard-brand-muted/50 dark:bg-dark-unodashboard-brand-muted',
                )}
            >
                <div
                    className={unoTwMerge(
                        makeProgressBarClassName('progressBar'),
                        'flex-col h-full rounded-unodashboard-full',
                        color
                            ? getColorClassNames(color, colorPalette.background).bgColor
                            : 'bg-unodashboard-brand dark:bg-dark-unodashboard-brand',
                        showAnimation ? 'transition-all duration-300 ease-in-out' : '',
                    )}
                    style={{
                        width: `${value}%`,
                    }}
                />
            </div>
            {label ? (
                <div
                    className={unoTwMerge(
                        makeProgressBarClassName('labelWrapper'),
                        'w-16 truncate text-right ml-2',
                        'text-unodashboard-content-emphasis',
                        'dark:text-dark-unodashboard-content-emphasis',
                    )}
                >
                    <p
                        className={unoTwMerge(
                            makeProgressBarClassName('label'),
                            'shrink-0 whitespace-nowrap truncate text-unodashboard-default',
                        )}
                    >
                        {label}
                    </p>
                </div>
            ) : null}
        </div>
    ),
);
