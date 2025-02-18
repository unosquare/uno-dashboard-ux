import React from 'react';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeListClassName = makeClassName('List');

export const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
    ({ children, className, ...other }, ref) => (
        <ul
            ref={ref}
            className={unoTwMerge(
                makeListClassName('root'),
                // common
                'w-full divide-y',
                // light
                'divide-unodashboard-border text-unodashboard-content',
                // dark
                'dark:divide-dark-unodashboard-border dark:text-dark-unodashboard-content',
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
            className={unoTwMerge(
                makeListItemClassName('root'),
                // common
                'w-full flex justify-between items-center text-unodashboard-default py-2',
                className,
            )}
            {...other}
        >
            {children}
        </li>
    ),
);
