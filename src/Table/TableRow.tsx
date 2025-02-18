import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeRowClassName = makeClassName('TableRow');

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ children, className, ...other }, ref) => (
        <tr ref={ref} className={unoTwMerge(makeRowClassName('row'), className)} {...other}>
            {children}
        </tr>
    ),
);
