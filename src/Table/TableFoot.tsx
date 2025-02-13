import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeTableFootClassName = makeClassName('TableFoot');

export const TableFoot = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ children, className, ...other }, ref) => (
        <tfoot
            ref={ref}
            className={tremorTwMerge(
                makeTableFootClassName('root'),
                // common
                'text-left font-medium border-t-[1px] ',
                // light
                'text-tremor-content border-tremor-border',
                // dark
                'dark:text-dark-tremor-content dark:border-dark-tremor-border',
                className,
            )}
            {...other}
        >
            {children}
        </tfoot>
    ),
);
