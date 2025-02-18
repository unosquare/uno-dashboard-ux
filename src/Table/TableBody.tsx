import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTableBodyClassName = makeClassName('TableBody');

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ children, className, ...other }, ref) => (
        <tbody
            ref={ref}
            className={unoTwMerge(
                makeTableBodyClassName('root'),
                // common
                'align-top divide-y',
                // light
                'divide-unodashboard-border',
                // dark
                'dark:divide-dark-unodashboard-border',
                className,
            )}
            {...other}
        >
            {children}
        </tbody>
    ),
);
