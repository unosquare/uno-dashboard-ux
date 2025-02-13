import React, { useEffect } from 'react';
import useTransition, { type TransitionStatus } from 'react-transition-state';
import {
    type ButtonVariant,
    type Color,
    type HorizontalPosition,
    HorizontalPositions,
    type Size,
    Sizes,
} from '../constants';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';
import { getButtonColors, getButtonProportions, iconSizes } from './styles';

const makeButtonClassName = makeClassName('Button');

const LoadingSpinner = ({ ...props }) => (
    <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
        <title>Loading...</title>
        <path fill='none' d='M0 0h24v24H0z' />
        <path d='M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z' />
    </svg>
);

export interface ButtonIconOrSpinnerProps {
    loading: boolean;
    iconSize: string;
    iconPosition: string;
    Icon: React.ElementType | undefined;
    needMargin: boolean;
    transitionStatus: TransitionStatus;
}

export const ButtonIconOrSpinner = ({
    loading,
    iconSize,
    iconPosition,
    Icon,
    needMargin,
    transitionStatus,
}: ButtonIconOrSpinnerProps) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    Icon = Icon!;

    const margin = !needMargin
        ? ''
        : iconPosition === HorizontalPositions.Left
          ? tremorTwMerge('-ml-1', 'mr-1.5')
          : tremorTwMerge('-mr-1', 'ml-1.5');

    const defaultSpinnerSize = tremorTwMerge('w-0 h-0');
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const spinnerSize: { [key: string]: any } = {
        default: defaultSpinnerSize,
        entering: defaultSpinnerSize,
        entered: iconSize,
        exiting: iconSize,
        exited: defaultSpinnerSize,
    };

    return loading ? (
        <LoadingSpinner
            className={tremorTwMerge(
                makeButtonClassName('icon'),
                'animate-spin shrink-0',
                margin,
                spinnerSize.default,
                spinnerSize[transitionStatus],
            )}
            style={{ transition: 'width 150ms' }}
        />
    ) : (
        <Icon className={tremorTwMerge(makeButtonClassName('icon'), 'shrink-0', iconSize, margin)} />
    );
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ElementType;
    iconPosition?: HorizontalPosition;
    size?: Size;
    color?: Color;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        icon,
        iconPosition = HorizontalPositions.Left,
        size = Sizes.SM,
        color,
        variant = 'primary',
        disabled,
        loading = false,
        loadingText,
        children,
        className,
        ...other
    } = props;

    const Icon = icon;

    const isDisabled = loading || disabled;
    const showButtonIconOrSpinner = Icon !== undefined || loading;
    const showLoadingText = loading && loadingText;
    const needIconMargin = !!(children || showLoadingText);

    const iconSize = tremorTwMerge(iconSizes[size].height, iconSizes[size].width);
    const buttonShapeStyles =
        variant !== 'light'
            ? tremorTwMerge(
                  // common
                  'rounded-tremor-default border',
                  // light
                  'shadow-tremor-input',
                  // dark
                  'dark:shadow-dark-tremor-input',
              )
            : '';
    const buttonColorStyles = getButtonColors(variant, color);
    const buttonProportionStyles = getButtonProportions(variant)[size];

    const [transitionState, toggleTransition] = useTransition({ timeout: 50 });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        toggleTransition(loading);
    }, [loading]);

    return (
        <button
            ref={ref}
            className={tremorTwMerge(
                makeButtonClassName('root'),
                // common
                'shrink-0 inline-flex justify-center items-center group font-medium outline-none',
                buttonShapeStyles,
                buttonProportionStyles.paddingX,
                buttonProportionStyles.paddingY,
                buttonProportionStyles.fontSize,
                buttonColorStyles.textColor,
                buttonColorStyles.bgColor,
                buttonColorStyles.borderColor,
                buttonColorStyles.hoverBorderColor,
                !isDisabled
                    ? tremorTwMerge(
                          getButtonColors(variant, color).hoverTextColor,
                          getButtonColors(variant, color).hoverBgColor,
                          getButtonColors(variant, color).hoverBorderColor,
                      )
                    : 'opacity-50 cursor-not-allowed',
                className,
            )}
            disabled={isDisabled}
            {...other}
        >
            {showButtonIconOrSpinner && iconPosition !== HorizontalPositions.Right ? (
                <ButtonIconOrSpinner
                    loading={loading}
                    iconSize={iconSize}
                    iconPosition={iconPosition}
                    Icon={Icon}
                    transitionStatus={transitionState.status}
                    needMargin={needIconMargin}
                />
            ) : null}
            {showLoadingText || children ? (
                <span className={tremorTwMerge(makeButtonClassName('text'), 'text-tremor-default whitespace-nowrap')}>
                    {showLoadingText ? loadingText : children}
                </span>
            ) : null}
            {showButtonIconOrSpinner && iconPosition === HorizontalPositions.Right ? (
                <ButtonIconOrSpinner
                    loading={loading}
                    iconSize={iconSize}
                    iconPosition={iconPosition}
                    Icon={Icon}
                    transitionStatus={transitionState.status}
                    needMargin={needIconMargin}
                />
            ) : null}
        </button>
    );
});
