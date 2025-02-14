import React from 'react';
import { type BadgeProportionTypes, type DeltaType, DeltaTypes, type Size, Sizes } from '../constants';
import { BaseColors, colorPalette, getColorClassNames, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const ArrowRightIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Right</title>
        <path d='M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z' />
    </svg>
);

const ArrowUpIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Up</title>
        <path d='M13.0001 7.82843V20H11.0001V7.82843L5.63614 13.1924L4.22192 11.7782L12.0001 4L19.7783 11.7782L18.3641 13.1924L13.0001 7.82843Z' />
    </svg>
);

const ArrowUpRightIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Up Right</title>
        <path d='M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z' />
    </svg>
);

const ArrowDownIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Down</title>
        <path d='M13.0001 16.1716L18.3641 10.8076L19.7783 12.2218L12.0001 20L4.22192 12.2218L5.63614 10.8076L11.0001 16.1716V4H13.0001V16.1716Z' />
    </svg>
);

const ArrowDownRightIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Down Right</title>
        <path d='M14.5895 16.0032L5.98291 7.39664L7.39712 5.98242L16.0037 14.589V7.00324H18.0037V18.0032H7.00373V16.0032H14.5895Z' />
    </svg>
);

const mapInputsToDeltaType = (deltaType: string, isIncreasePositive: boolean): string => {
    if (isIncreasePositive || deltaType === DeltaTypes.Unchanged) {
        return deltaType;
    }

    switch (deltaType) {
        case DeltaTypes.Increase:
            return DeltaTypes.Decrease;
        case DeltaTypes.ModerateIncrease:
            return DeltaTypes.ModerateDecrease;
        case DeltaTypes.Decrease:
            return DeltaTypes.Increase;
        case DeltaTypes.ModerateDecrease:
            return DeltaTypes.ModerateIncrease;
        default:
            return '';
    }
};

export const badgeProportionsIconOnly: {
    [char: string]: BadgeProportionTypes;
} = {
    xs: {
        paddingX: 'px-2',
        paddingY: 'py-0.5',
        fontSize: 'text-xs',
    },
    sm: {
        paddingX: 'px-2.5',
        paddingY: 'py-1',
        fontSize: 'text-sm',
    },
    md: {
        paddingX: 'px-3',
        paddingY: 'py-1.5',
        fontSize: 'text-md',
    },
    lg: {
        paddingX: 'px-3.5',
        paddingY: 'py-1.5',
        fontSize: 'text-lg',
    },
    xl: {
        paddingX: 'px-3.5',
        paddingY: 'py-1.5',
        fontSize: 'text-xl',
    },
};

export const badgeProportionsWithText: {
    [char: string]: BadgeProportionTypes;
} = {
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

export const iconSizes: {
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

export type ColorTypes = {
    bgColor: string;
    textColor: string;
    ringColor: string;
};

export const colors: { [key: string]: ColorTypes } = {
    [DeltaTypes.Increase]: {
        bgColor: getColorClassNames(BaseColors.Emerald, colorPalette.background).bgColor,
        textColor: getColorClassNames(BaseColors.Emerald, colorPalette.iconText).textColor,
        ringColor: getColorClassNames(BaseColors.Emerald, colorPalette.iconRing).ringColor,
    },
    [DeltaTypes.ModerateIncrease]: {
        bgColor: getColorClassNames(BaseColors.Emerald, colorPalette.background).bgColor,
        textColor: getColorClassNames(BaseColors.Emerald, colorPalette.iconText).textColor,
        ringColor: getColorClassNames(BaseColors.Emerald, colorPalette.iconRing).ringColor,
    },
    [DeltaTypes.Decrease]: {
        bgColor: getColorClassNames(BaseColors.Red, colorPalette.background).bgColor,
        textColor: getColorClassNames(BaseColors.Red, colorPalette.iconText).textColor,
        ringColor: getColorClassNames(BaseColors.Red, colorPalette.iconRing).ringColor,
    },
    [DeltaTypes.ModerateDecrease]: {
        bgColor: getColorClassNames(BaseColors.Red, colorPalette.background).bgColor,
        textColor: getColorClassNames(BaseColors.Red, colorPalette.iconText).textColor,
        ringColor: getColorClassNames(BaseColors.Red, colorPalette.iconRing).ringColor,
    },
    [DeltaTypes.Unchanged]: {
        bgColor: getColorClassNames(BaseColors.Orange, colorPalette.background).bgColor,
        textColor: getColorClassNames(BaseColors.Orange, colorPalette.iconText).textColor,
        ringColor: getColorClassNames(BaseColors.Orange, colorPalette.iconRing).ringColor,
    },
};

export const deltaIcons: { [key: string]: React.ElementType } = {
    [DeltaTypes.Increase]: ArrowUpIcon,
    [DeltaTypes.ModerateIncrease]: ArrowUpRightIcon,
    [DeltaTypes.Decrease]: ArrowDownIcon,
    [DeltaTypes.ModerateDecrease]: ArrowDownRightIcon,
    [DeltaTypes.Unchanged]: ArrowRightIcon,
};

const makeBadgeDeltaClassName = makeClassName('BadgeDelta');

export interface BadgeDeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
    deltaType?: DeltaType;
    isIncreasePositive?: boolean;
    size?: Size;
}

export const BadgeDelta = React.forwardRef<HTMLSpanElement, BadgeDeltaProps>((props, ref) => {
    const {
        deltaType = DeltaTypes.Increase,
        isIncreasePositive = true,
        size = Sizes.SM,
        children,
        className,
        ...other
    } = props;

    const Icon = deltaIcons[deltaType];
    const mappedDeltaType = mapInputsToDeltaType(deltaType, isIncreasePositive);
    const badgeProportions = children ? badgeProportionsWithText : badgeProportionsIconOnly;

    return (
        <span
            ref={ref}
            className={tremorTwMerge(
                makeBadgeDeltaClassName('root'),
                // common
                'w-max shrink-0 inline-flex justify-center items-center cursor-default rounded-tremor-small ring-1 ring-inset',
                colors[mappedDeltaType].bgColor,
                colors[mappedDeltaType].textColor,
                colors[mappedDeltaType].ringColor,
                badgeProportions[size].paddingX,
                badgeProportions[size].paddingY,
                badgeProportions[size].fontSize,
                // light
                'bg-opacity-10 ring-opacity-20',
                // dark
                'dark:bg-opacity-5 dark:ring-opacity-60',
                className,
            )}
            {...other}
        >
            <Icon
                className={tremorTwMerge(
                    makeBadgeDeltaClassName('icon'),
                    'shrink-0',
                    children ? tremorTwMerge('-ml-1 mr-1.5') : iconSizes[size].height,
                    iconSizes[size].width,
                )}
            />
            {children ? (
                <span className={tremorTwMerge(makeBadgeDeltaClassName('text'), 'whitespace-nowrap')}>{children}</span>
            ) : null}
        </span>
    );
});
