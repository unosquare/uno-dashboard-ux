import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTableClassName = makeClassName('Table');

export const TableBase = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
    ({ children, className, ...other }, ref) => (
        <div className={unoTwMerge(makeTableClassName('root'), 'overflow-auto', className)}>
            <table
                ref={ref}
                className={unoTwMerge(
                    makeTableClassName('table'),
                    // common
                    'w-full text-unodashboard-default',
                    // light
                    'text-unodashboard-content',
                    // dark
                    'dark:text-dark-unodashboard-content',
                )}
                {...other}
            >
                {children}
            </table>
        </div>
    ),
);
