import React from 'react';
import { type Color, type Size, Sizes } from '../constants';
import { type IconVariant, getIconColors, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeIconClassName = makeClassName('Icon');

export type WrapperProportionTypes = {
    paddingX: string;
    paddingY: string;
};

export const wrapperProportions: { [size: string]: WrapperProportionTypes } = {
    xs: {
        paddingX: 'px-1.5',
        paddingY: 'py-1.5',
    },
    sm: {
        paddingX: 'px-1.5',
        paddingY: 'py-1.5',
    },
    md: {
        paddingX: 'px-2',
        paddingY: 'py-2',
    },
    lg: {
        paddingX: 'px-2',
        paddingY: 'py-2',
    },
    xl: {
        paddingX: 'px-2.5',
        paddingY: 'py-2.5',
    },
};

const iconSizes: {
    [size: string]: {
        height: string;
        width: string;
    };
} = {
    xs: {
        height: 'h-3',
        width: 'w-3',
    },
    sm: {
        height: 'h-5',
        width: 'w-5',
    },
    md: {
        height: 'h-5',
        width: 'w-5',
    },
    lg: {
        height: 'h-7',
        width: 'w-7',
    },
    xl: {
        height: 'h-9',
        width: 'w-9',
    },
};

export type ShapeTypes = {
    rounded: string;
    border: string;
    ring: string;
    shadow: string;
};

export const shape: { [style: string]: ShapeTypes } = {
    simple: {
        rounded: '',
        border: '',
        ring: '',
        shadow: '',
    },
    light: {
        rounded: 'rounded-tremor-default',
        border: '',
        ring: '',
        shadow: '',
    },
    shadow: {
        rounded: 'rounded-tremor-default',
        border: 'border',
        ring: '',
        shadow: 'shadow-tremor-card dark:shadow-dark-tremor-card',
    },
    solid: {
        rounded: 'rounded-tremor-default',
        border: 'border-2',
        ring: 'ring-1',
        shadow: '',
    },
    outlined: {
        rounded: 'rounded-tremor-default',
        border: 'border',
        ring: 'ring-2',
        shadow: '',
    },
};

export const IconVariants: { [key: string]: IconVariant } = {
    Simple: 'simple',
    Light: 'light',
    Shadow: 'shadow-sm',
    Solid: 'solid',
    Outlined: 'outlined',
};

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    icon: React.ElementType;
    variant?: IconVariant;
    size?: Size;
    color?: Color;
}

export const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
    ({ icon, variant = IconVariants.Simple, size = Sizes.SM, color, className, ...other }, ref) => {
        const Icon = icon;
        const iconColorStyles = getIconColors(variant, color);

        return (
            <span
                ref={ref}
                className={tremorTwMerge(
                    makeIconClassName('root'),
                    'inline-flex shrink-0 items-center justify-center',
                    iconColorStyles.bgColor,
                    iconColorStyles.textColor,
                    iconColorStyles.borderColor,
                    iconColorStyles.ringColor,
                    shape[variant].rounded,
                    shape[variant].border,
                    shape[variant].shadow,
                    shape[variant].ring,
                    wrapperProportions[size].paddingX,
                    wrapperProportions[size].paddingY,
                    className,
                )}
                {...other}
            >
                <Icon
                    className={tremorTwMerge(
                        makeIconClassName('icon'),
                        'shrink-0',
                        iconSizes[size].height,
                        iconSizes[size].width,
                    )}
                />
            </span>
        );
    },
);
