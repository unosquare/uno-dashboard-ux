import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

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
            className={tremorTwMerge(makeProgressBarClassName('root'), 'flex items-center w-full', className)}
            {...other}
        >
            <div
                className={tremorTwMerge(
                    makeProgressBarClassName('progressBarWrapper'),
                    'relative flex items-center w-full rounded-tremor-full bg-opacity-20 h-2',
                    color
                        ? getColorClassNames(color, colorPalette.background).bgColor
                        : 'bg-tremor-brand-muted/50 dark:bg-dark-tremor-brand-muted',
                )}
            >
                <div
                    className={tremorTwMerge(
                        makeProgressBarClassName('progressBar'),
                        'flex-col h-full rounded-tremor-full',
                        color
                            ? getColorClassNames(color, colorPalette.background).bgColor
                            : 'bg-tremor-brand dark:bg-dark-tremor-brand',
                        showAnimation ? 'transition-all duration-300 ease-in-out' : '',
                    )}
                    style={{
                        width: `${value}%`,
                    }}
                />
            </div>
            {label ? (
                <div
                    className={tremorTwMerge(
                        makeProgressBarClassName('labelWrapper'),
                        'w-16 truncate text-right ml-2',
                        'text-tremor-content-emphasis',
                        'dark:text-dark-tremor-content-emphasis',
                    )}
                >
                    <p
                        className={tremorTwMerge(
                            makeProgressBarClassName('label'),
                            'shrink-0 whitespace-nowrap truncate text-tremor-default',
                        )}
                    >
                        {label}
                    </p>
                </div>
            ) : null}
        </div>
    ),
);
