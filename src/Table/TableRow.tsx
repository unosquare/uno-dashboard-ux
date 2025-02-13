import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeRowClassName = makeClassName('TableRow');

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ children, className, ...other }, ref) => (
        <tr ref={ref} className={tremorTwMerge(makeRowClassName('row'), className)} {...other}>
            {children}
        </tr>
    ),
);
