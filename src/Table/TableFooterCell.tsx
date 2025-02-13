import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeTableFooterCellClassName = makeClassName('TableFooterCell');

export const TableFooterCell = React.forwardRef<HTMLTableCellElement, React.HTMLAttributes<HTMLTableCellElement>>(
    ({ children, className, ...other }, ref) => (
        <th
            ref={ref}
            className={tremorTwMerge(
                makeTableFooterCellClassName('root'),
                // common
                'top-0 px-4 py-3.5',
                // light
                'text-tremor-content font-medium',
                // dark
                'dark:text-dark-tremor-content',
                className,
            )}
            {...other}
        >
            {children}
        </th>
    ),
);
