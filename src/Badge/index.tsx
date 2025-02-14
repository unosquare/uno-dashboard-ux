import React from 'react';
import { type BadgeProportionTypes, type Color, type Size, Sizes } from '../constants';
import { colorPalette, getColorClassNames, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeBadgeClassName = makeClassName('Badge');

export const badgeProportions: { [char: string]: BadgeProportionTypes } = {
    xs: {
        paddingX: 'px-2',
        paddingY: 'py-0.5',
        fontSize: 'text-xs',
    },
    sm: {
        paddingX: 'px-2.5',
        paddingY: 'py-0.5',
        fontSize: 'text-sm',
    },
    md: {
        paddingX: 'px-3',
        paddingY: 'py-0.5',
        fontSize: 'text-md',
    },
    lg: {
        paddingX: 'px-3.5',
        paddingY: 'py-0.5',
        fontSize: 'text-lg',
    },
    xl: {
        paddingX: 'px-4',
        paddingY: 'py-1',
        fontSize: 'text-xl',
    },
};

const iconSizes: {
    [size: string]: {
        height: string;
        width: string;
    };
} = {
    xs: {
        height: 'h-4',
        width: 'w-4',
    },
    sm: {
        height: 'h-4',
        width: 'w-4',
    },
    md: {
        height: 'h-4',
        width: 'w-4',
    },
    lg: {
        height: 'h-5',
        width: 'w-5',
    },
    xl: {
        height: 'h-6',
        width: 'w-6',
    },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    color?: Color;
    size?: Size;
    icon?: React.ElementType;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ color, icon, size = Sizes.SM, className, children, ...other }, ref) => {
        const Icon = icon ? icon : null;

        return (
            <span
                ref={ref}
                className={tremorTwMerge(
                    makeBadgeClassName('root'),
                    // common
                    'w-max shrink-0 inline-flex justify-center items-center cursor-default rounded-tremor-small ring-1 ring-inset',
                    color
                        ? tremorTwMerge(
                              getColorClassNames(color, colorPalette.background).bgColor,
                              getColorClassNames(color, colorPalette.iconText).textColor,
                              getColorClassNames(color, colorPalette.iconRing).ringColor,
                              // light
                              'bg-opacity-10 ring-opacity-20',
                              // dark
                              'dark:bg-opacity-5 dark:ring-opacity-60',
                          )
                        : tremorTwMerge(
                              // light
                              'bg-tremor-brand-faint text-tremor-brand-emphasis ring-tremor-brand/20',
                              // dark
                              'dark:bg-dark-tremor-brand-muted/50 dark:text-dark-tremor-brand dark:ring-dark-tremor-subtle/20',
                          ),
                    badgeProportions[size].paddingX,
                    badgeProportions[size].paddingY,
                    badgeProportions[size].fontSize,
                    className,
                )}
                {...other}
            >
                {Icon ? (
                    <Icon
                        className={tremorTwMerge(
                            makeBadgeClassName('icon'),
                            'shrink-0 -ml-1 mr-1.5',
                            iconSizes[size].height,
                            iconSizes[size].width,
                        )}
                    />
                ) : null}
                <span className={tremorTwMerge(makeBadgeClassName('text'), 'whitespace-nowrap')}>{children}</span>
            </span>
        );
    },
);
