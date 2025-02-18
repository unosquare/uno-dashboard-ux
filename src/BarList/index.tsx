import React from 'react';
import type { Color } from '../constants';
import { type ValueFormatter, colorPalette, getColorClassNames, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeBarListClassName = makeClassName('BarList');

type Bar<T> = T & {
    key?: string;
    value: number;
    name: React.ReactNode;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon?: React.JSXElementConstructor<any>;
    href?: string;
    target?: string;
    color?: Color;
};

export interface BarListProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    data: Bar<T>[];
    valueFormatter?: ValueFormatter;
    color?: Color;
    showAnimation?: boolean;
    onValueChange?: (payload: Bar<T>) => void;
    sortOrder?: 'ascending' | 'descending' | 'none';
}

const defaultValueFormatter: ValueFormatter = (value: number) => value.toString();

function BarListInner<T>(
    {
        data = [],
        color,
        valueFormatter = defaultValueFormatter,
        showAnimation = false,
        onValueChange,
        sortOrder = 'descending',
        className,
        ...other
    }: BarListProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const Component = onValueChange ? 'button' : 'div';
    const sortedData = React.useMemo(() => {
        if (sortOrder === 'none') {
            return data;
        }
        return [...data].sort((a, b) => {
            return sortOrder === 'ascending' ? a.value - b.value : b.value - a.value;
        });
    }, [data, sortOrder]);

    const widths = React.useMemo(() => {
        const maxValue = Math.max(...sortedData.map((item) => item.value), 0);
        return sortedData.map((item) => (item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, 2)));
    }, [sortedData]);

    const rowHeight = 'h-8';

    return (
        <div
            ref={ref}
            className={unoTwMerge(makeBarListClassName('root'), 'flex justify-between space-x-6', className)}
            aria-sort={sortOrder}
            {...other}
        >
            <div className={unoTwMerge(makeBarListClassName('bars'), 'relative w-full space-y-1.5')}>
                {sortedData.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <Component
                            key={item.key ?? index}
                            onClick={() => {
                                onValueChange?.(item);
                            }}
                            className={unoTwMerge(
                                makeBarListClassName('bar'),
                                // common
                                'group w-full flex items-center rounded-unodashboard-small',
                                onValueChange
                                    ? [
                                          'cursor-pointer',
                                          // hover
                                          'hover:bg-unodashboard-background-muted dark:hover:bg-dark-unodashboard-background-subtle/40',
                                      ]
                                    : '',
                            )}
                        >
                            <div
                                className={unoTwMerge(
                                    'flex items-center rounded-sm transition-all bg-opacity-40',
                                    rowHeight,
                                    item.color || color
                                        ? [
                                              getColorClassNames(
                                                  item.color ?? (color as Color),
                                                  colorPalette.background,
                                              ).bgColor,
                                              onValueChange ? 'group-hover:bg-opacity-30' : '',
                                          ]
                                        : 'bg-unodashboard-brand-subtle dark:bg-dark-unodashboard-brand-subtle/60',
                                    onValueChange && !(item.color || color)
                                        ? 'group-hover:bg-unodashboard-brand-subtle/30 dark:group-hover:bg-dark-unodashboard-brand-subtle/70'
                                        : '',
                                    // margin
                                    index === sortedData.length - 1 ? 'mb-0' : '',
                                    // duration
                                    showAnimation ? 'duration-500' : '',
                                )}
                                style={{ width: `${widths[index]}%`, transition: showAnimation ? 'all 1s' : '' }}
                            >
                                <div className={unoTwMerge('absolute left-2 pr-4 flex max-w-full')}>
                                    {Icon ? (
                                        <Icon
                                            className={unoTwMerge(
                                                makeBarListClassName('barIcon'),
                                                // common
                                                'flex-none h-5 w-5 mr-2',
                                                // light
                                                'text-unodashboard-content',
                                                // dark
                                                'dark:text-dark-unodashboard-content',
                                            )}
                                        />
                                    ) : null}
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target={item.target ?? '_blank'}
                                            rel='noreferrer'
                                            className={unoTwMerge(
                                                makeBarListClassName('barLink'),
                                                // common
                                                'whitespace-nowrap hover:underline truncate text-unodashboard-default',
                                                onValueChange ? 'cursor-pointer' : '',
                                                // light
                                                'text-unodashboard-content-emphasis',
                                                // dark
                                                'dark:text-dark-unodashboard-content-emphasis',
                                            )}
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            {item.name}
                                        </a>
                                    ) : (
                                        <p
                                            className={unoTwMerge(
                                                makeBarListClassName('barText'),
                                                // common
                                                'whitespace-nowrap truncate text-unodashboard-default',
                                                // light
                                                'text-unodashboard-content-emphasis',
                                                // dark
                                                'dark:text-dark-unodashboard-content-emphasis',
                                            )}
                                        >
                                            {item.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Component>
                    );
                })}
            </div>
            <div className={makeBarListClassName('labels')}>
                {sortedData.map((item, index) => (
                    <div
                        key={item.key ?? index}
                        className={unoTwMerge(
                            makeBarListClassName('labelWrapper'),
                            'flex justify-end items-center',
                            rowHeight,
                            index === sortedData.length - 1 ? 'mb-0' : 'mb-1.5',
                        )}
                    >
                        <p
                            className={unoTwMerge(
                                makeBarListClassName('labelText'),
                                // common
                                'whitespace-nowrap leading-none truncate text-unodashboard-default',
                                // light
                                'text-unodashboard-content-emphasis',
                                // dark
                                'dark:text-dark-unodashboard-content-emphasis',
                            )}
                        >
                            {valueFormatter(item.value)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const BarList = React.forwardRef(BarListInner) as <T>(
    p: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof BarListInner>;
