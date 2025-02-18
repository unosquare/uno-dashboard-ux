import React from 'react';
import {
    type Color,
    type HorizontalPosition,
    HorizontalPositions,
    type VerticalPosition,
    VerticalPositions,
} from '../constants';
import { colorPalette, getColorClassNames, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

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
            className={unoTwMerge(
                makeCardClassName('root'),
                // common
                'relative w-full text-left ring-1 rounded-unodashboard-default p-6',
                // light
                'bg-unodashboard-background ring-unodashboard-ring shadow-unodashboard-card',
                // dark
                'dark:bg-dark-unodashboard-background dark:ring-dark-unodashboard-ring dark:shadow-dark-unodashboard-card',
                // brand
                decorationColor
                    ? getColorClassNames(decorationColor, colorPalette.border).borderColor
                    : 'border-unodashboard-brand dark:border-dark-unodashboard-brand',
                parseDecorationAlignment(decoration),
                className,
            )}
            {...other}
        >
            {children}
        </div>
    );
});
