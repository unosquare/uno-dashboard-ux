import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTableHeadClassName = makeClassName('TableHead');

export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ children, className, ...other }, ref) => (
        <thead
            ref={ref}
            className={unoTwMerge(
                makeTableHeadClassName('root'),
                // common
                'text-left',
                // light
                'text-unodashboard-content',
                // dark
                'dark:text-dark-unodashboard-content',
                className,
            )}
            {...other}
        >
            {children}
        </thead>
    ),
);
