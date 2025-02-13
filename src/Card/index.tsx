import React from 'react';
import { colorPalette, getColorClassNames, makeClassName } from '../theme';
import {
    type Color,
    type HorizontalPosition,
    HorizontalPositions,
    type VerticalPosition,
    VerticalPositions,
} from '../constants';
import { tremorTwMerge } from '../tremorTwMerge';

const makeCardClassName = makeClassName('Card');

const parseDecorationAlignment = (decorationAlignment: string) => {
    if (!decorationAlignment) return '';
    switch (decorationAlignment) {
        case HorizontalPositions.Left:
            return 'border-l-4';
        case VerticalPositions.Top:
            return 'border-t-4';
        case HorizontalPositions.Right:
            return 'border-r-4';
        case VerticalPositions.Bottom:
            return 'border-b-4';
        default:
            return '';
    }
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    decoration?: HorizontalPosition | VerticalPosition | '';
    decorationColor?: Color;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { decoration = '', decorationColor, children, className, ...other } = props;
    return (
        <div
            ref={ref}
            className={tremorTwMerge(
                makeCardClassName('root'),
                // common
                'relative w-full text-left ring-1 rounded-tremor-default p-6',
                // light
                'bg-tremor-background ring-tremor-ring shadow-tremor-card',
                // dark
                'dark:bg-dark-tremor-background dark:ring-dark-tremor-ring dark:shadow-dark-tremor-card',
                // brand
                decorationColor
                    ? getColorClassNames(decorationColor, colorPalette.border).borderColor
                    : 'border-tremor-brand dark:border-dark-tremor-brand',
                parseDecorationAlignment(decoration),
                className,
            )}
            {...other}
        >
            {children}
        </div>
    );
});
