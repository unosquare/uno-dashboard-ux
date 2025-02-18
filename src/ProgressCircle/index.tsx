import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeProgressCircleClassName = makeClassName('ProgressBar');

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    size?: Size;
    color?: Color;
    showAnimation?: boolean;
    radius?: number;
    strokeWidth?: number;
    children?: React.ReactNode;
}

const size2config: Record<Size, { strokeWidth: number; radius: number }> = {
    xs: {
        radius: 15,
        strokeWidth: 3,
    },
    sm: {
        radius: 19,
        strokeWidth: 4,
    },
    md: {
        radius: 32,
        strokeWidth: 6,
    },
    lg: {
        radius: 52,
        strokeWidth: 8,
    },
    xl: {
        radius: 80,
        strokeWidth: 10,
    },
};

function getLimitedValue(input: number | undefined) {
    if (input === undefined) return 0;

    return input > 100 ? 100 : input;
}

export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
    (
        {
            value: inputValue,
            size = 'md',
            className,
            showAnimation = true,
            color,
            radius: inputRadius,
            strokeWidth: inputStrokeWidth,
            children,
            ...other
        },
        ref,
    ) => {
        // sanitize input
        const value = getLimitedValue(inputValue);
        const radius = inputRadius ?? size2config[size].radius;
        const strokeWidth = inputStrokeWidth ?? size2config[size].strokeWidth;
        const normalizedRadius = radius - strokeWidth / 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = (value / 100) * circumference;
        const offset = circumference - strokeDashoffset;

        return (
            <div
                ref={ref}
                className={unoTwMerge(
                    makeProgressCircleClassName('root'),
                    'flex flex-col items-center justify-center',
                    className,
                )}
                {...other}
            >
                <svg
                    width={radius * 2}
                    height={radius * 2}
                    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    className='transform -rotate-90'
                >
                    <title>Progress</title>
                    <circle
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        strokeWidth={strokeWidth}
                        fill='transparent'
                        stroke=''
                        strokeLinecap='round'
                        className={unoTwMerge(
                            'transition-colors ease-linear',
                            color
                                ? `${
                                      getColorClassNames(color, colorPalette.background).strokeColor
                                  } opacity-20 dark:opacity-25`
                                : 'stroke-unodashboard-brand-muted/50 dark:stroke-dark-unodashboard-brand-muted',
                        )}
                    />
                    {value >= 0 ? (
                        <circle
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={offset}
                            fill='transparent'
                            stroke=''
                            strokeLinecap='round'
                            className={unoTwMerge(
                                'transition-colors ease-linear',
                                color
                                    ? getColorClassNames(color, colorPalette.background).strokeColor
                                    : 'stroke-unodashboard-brand dark:stroke-dark-unodashboard-brand',
                                showAnimation ? 'transition-all duration-300 ease-in-out' : '',
                            )}
                        />
                    ) : null}
                </svg>
                <div className={unoTwMerge('absolute flex')}>{children}</div>
            </div>
        );
    },
);
