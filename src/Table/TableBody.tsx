import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeTableBodyClassName = makeClassName('TableBody');

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ children, className, ...other }, ref) => (
        <tbody
            ref={ref}
            className={tremorTwMerge(
                makeTableBodyClassName('root'),
                // common
                'align-top divide-y',
                // light
                'divide-tremor-border',
                // dark
                'dark:divide-dark-tremor-border',
                className,
            )}
            {...other}
        >
            {children}
        </tbody>
    ),
);
