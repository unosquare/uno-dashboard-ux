import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTableFootClassName = makeClassName('TableFoot');

export const TableFoot = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ children, className, ...other }, ref) => (
        <tfoot
            ref={ref}
            className={unoTwMerge(
                makeTableFootClassName('root'),
                // common
                'text-left font-medium border-t-[1px] ',
                // light
                'text-unodashboard-content border-unodashboard-border',
                // dark
                'dark:text-dark-unodashboard-content dark:border-dark-unodashboard-border',
                className,
            )}
            {...other}
        >
            {children}
        </tfoot>
    ),
);
