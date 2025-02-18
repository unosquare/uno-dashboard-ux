import React from 'react';
import { type BadgeProportionTypes, type Color, type Size, Sizes } from '../constants';
import { colorPalette, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeBadgeClassName = makeClassName('badge');

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
        const Icon = icon || null;

        return (
            <span
                ref={ref}
                className={unoTwMerge(
                    makeBadgeClassName('root'),
                    // common
                    'w-max shrink-0 inline-flex justify-center items-center cursor-default rounded-unodashboard-small ring-1 ring-inset',
                    color
                        ? unoTwMerge(
                              `bg-${color}-${colorPalette.lightBackground} dark:bg-${color}-${colorPalette.lightBackground}`,
                              `text-${color}-${colorPalette.iconText} dark:text-${color}-${colorPalette.iconText}`,
                              `ring-${color}-${colorPalette.iconRing} dark:ring-${color}-${colorPalette.iconRing}`,
                          )
                        : unoTwMerge(
                              // light
                              'bg-unodashboard-brand-faint text-unodashboard-brand-emphasis ring-unodashboard-brand/20',
                              // dark
                              'dark:bg-dark-unodashboard-brand-muted/50 dark:text-dark-unodashboard-brand dark:ring-dark-unodashboard-subtle/20',
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
                        className={unoTwMerge(
                            makeBadgeClassName('icon'),
                            'shrink-0 -ml-1 mr-1.5',
                            iconSizes[size].height,
                            iconSizes[size].width,
                        )}
                    />
                ) : null}
                <span className={unoTwMerge(makeBadgeClassName('text'), 'whitespace-nowrap')}>{children}</span>
            </span>
        );
    },
);
