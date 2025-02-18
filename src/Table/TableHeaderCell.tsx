import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTableHeaderCellClassName = makeClassName('TableHeaderCell');

export const TableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ children, className, ...other }, ref) => (
        <th
            ref={ref}
            className={unoTwMerge(
                makeTableHeaderCellClassName('root'),
                // common
                'p-2 text-xs/[13px] whitespace-normal text-left font-semibold top-0',
                // light
                'text-unodashboard-content-strong',
                // dark
                'dark:text-dark-unodashboard-content-strong',
                className,
            )}
            {...other}
        >
            {children}
        </th>
    ),
);
