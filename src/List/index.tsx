import React from 'react';
import { makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeListClassName = makeClassName('List');

export const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
    ({ children, className, ...other }, ref) => (
        <ul
            ref={ref}
            className={tremorTwMerge(
                makeListClassName('root'),
                // common
                'w-full divide-y',
                // light
                'divide-tremor-border text-tremor-content',
                // dark
                'dark:divide-dark-tremor-border dark:text-dark-tremor-content',
                className,
            )}
            {...other}
        >
            {children}
        </ul>
    ),
);

const makeListItemClassName = makeClassName('ListItem');

export const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
    ({ children, className, ...other }, ref) => (
        <li
            ref={ref}
            className={tremorTwMerge(
                makeListItemClassName('root'),
                // common
                'w-full flex justify-between items-center text-tremor-default py-2',
                className,
            )}
            {...other}
        >
            {children}
        </li>
    ),
);
