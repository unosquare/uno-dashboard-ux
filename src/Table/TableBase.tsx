import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeTableClassName = makeClassName('Table');

export const TableBase = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
    ({ children, className, ...other }, ref) => (
        <div className={tremorTwMerge(makeTableClassName('root'), 'overflow-auto', className)}>
            <table
                ref={ref}
                className={tremorTwMerge(
                    makeTableClassName('table'),
                    // common
                    'w-full text-tremor-default',
                    // light
                    'text-tremor-content',
                    // dark
                    'dark:text-dark-tremor-content',
                )}
                {...other}
            >
                {children}
            </table>
        </div>
    ),
);
