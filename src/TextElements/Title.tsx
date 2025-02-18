import React from 'react';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

export interface TitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: Color;
}

export const Title = React.forwardRef<HTMLParagraphElement, TitleProps>((props, ref) => {
    const { color, children, className, ...other } = props;
    return (
        <p
            ref={ref}
            className={unoTwMerge(
                // common
                'font-medium text-unodashboard-title',
                color
                    ? getColorClassNames(color, colorPalette.darkText).textColor
                    : 'text-unodashboard-content-strong dark:text-dark-unodashboard-content-strong',
                className,
            )}
            {...other}
        >
            {children}
        </p>
    );
});
