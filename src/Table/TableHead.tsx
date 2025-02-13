import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeTableHeadClassName = makeClassName('TableHead');

export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ children, className, ...other }, ref) => (
        <thead
            ref={ref}
            className={tremorTwMerge(
                makeTableHeadClassName('root'),
                // common
                'text-left',
                // light
                'text-tremor-content',
                // dark
                'dark:text-dark-tremor-content',
                className,
            )}
            {...other}
        >
            {children}
        </thead>
    ),
);
