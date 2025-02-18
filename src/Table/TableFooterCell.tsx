import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTableFooterCellClassName = makeClassName('TableFooterCell');

export const TableFooterCell = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
    ({ children, className, ...other }, ref) => (
        <th
            ref={ref}
            className={unoTwMerge(
                makeTableFooterCellClassName('root'),
                // common
                'top-0 px-4 py-3.5',
                // light
                'text-unodashboard-content font-medium',
                // dark
                'dark:text-dark-unodashboard-content',
                className,
            )}
            {...other}
        >
            {children}
        </th>
    ),
);
