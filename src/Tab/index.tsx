import { Tab as HeadlessTab } from '@headlessui/react';
import React, { createContext, useContext } from 'react';
import type { Color } from '../constants';
import { SelectedValueContext } from '../reactUtils';
import { BaseColors, colorPalette, getColorClassNames, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeTabPanelClassName = makeClassName('TabPanel');

const IndexContext = createContext<number>(0);

const makeTabPanelsClassName = makeClassName('TabPanels');

export const TabPanels = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...other }, ref) => (
        <HeadlessTab.Panels
            as='div'
            ref={ref}
            className={unoTwMerge(makeTabPanelsClassName('root'), 'w-full', className)}
            {...other}
        >
            {({ selectedIndex }) => (
                <SelectedValueContext.Provider value={{ selectedValue: selectedIndex }}>
                    {React.Children.map(children, (child, index) => (
                        <IndexContext.Provider value={index}>{child}</IndexContext.Provider>
                    ))}
                </SelectedValueContext.Provider>
            )}
        </HeadlessTab.Panels>
    ),
);

export const TabPanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...other }, ref) => {
        const { selectedValue: selectedIndex } = useContext(SelectedValueContext);
        const index = useContext(IndexContext);

        const isSelected = selectedIndex === index;

        return (
            // Not using Tab.Panel because of https://github.com/tailwindlabs/headlessui/discussions/2366.
            <div
                ref={ref}
                className={unoTwMerge(
                    makeTabPanelClassName('root'),
                    'w-full mt-2',
                    isSelected ? '' : 'hidden',
                    className,
                )}
                aria-selected={isSelected ? 'true' : 'false'}
                {...other}
            >
                {children}
            </div>
        );
    },
);

const makeTabGroupClassName = makeClassName('TabGroup');

export interface TabGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultIndex?: number;
    index?: number;
    onIndexChange?: (index: number) => void;
    children: React.ReactElement[] | React.ReactElement;
}

export const TabGroup = React.forwardRef<HTMLDivElement, TabGroupProps>(
    ({ defaultIndex, index, onIndexChange, children, className, ...other }, ref) => (
        <HeadlessTab.Group
            as='div'
            ref={ref}
            defaultIndex={defaultIndex}
            selectedIndex={index}
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            onChange={onIndexChange as any}
            className={unoTwMerge(makeTabGroupClassName('root'), 'w-full', className)}
            {...other}
        >
            {children}
        </HeadlessTab.Group>
    ),
);

const BaseColorContext = createContext<Color | undefined>(BaseColors.Blue);

const makeTabListClassName = makeClassName('TabList');

export type TabVariant = 'line' | 'solid';

export const TabVariantContext = createContext<TabVariant>('line');

const variantStyles: { [key in TabVariant]: string } = {
    line: unoTwMerge(
        // common
        'flex border-b space-x-4',
        // light
        'border-unodashboard-border',
        // dark
        'dark:border-dark-unodashboard-border',
    ),
    solid: unoTwMerge(
        // common
        'inline-flex p-0.5 rounded-unodashboard-default space-x-1.5',
        // light
        'bg-unodashboard-background-subtle',
        // dark
        'dark:bg-dark-unodashboard-background-subtle',
    ),
};

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
    color?: Color;
    variant?: TabVariant;
    children: React.ReactElement[] | React.ReactElement;
}

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
    ({ color, variant = 'line', children, className, ...other }, ref) => (
        <HeadlessTab.List
            ref={ref}
            className={unoTwMerge(
                makeTabListClassName('root'),
                'justify-start overflow-x-clip',
                variantStyles[variant],
                className,
            )}
            {...other}
        >
            <TabVariantContext.Provider value={variant}>
                <BaseColorContext.Provider value={color}>{children}</BaseColorContext.Provider>
            </TabVariantContext.Provider>
        </HeadlessTab.List>
    ),
);

const makeTabClassName = makeClassName('Tab');

function getVariantStyles(tabVariant: TabVariant, color?: Color) {
    switch (tabVariant) {
        case 'line':
            return unoTwMerge(
                // common
                'data-selected:border-b-2 hover:border-b-2 border-transparent transition duration-100 -mb-px px-2 py-2',
                // light
                'hover:border-unodashboard-content hover:text-unodashboard-content-emphasis text-unodashboard-content',
                // dark
                'dark:[&:not([data-selected])]:hover:border-dark-unodashboard-content-emphasis dark:[&:not([data-selected])]:hover:text-dark-unodashboard-content-emphasis dark:[&:not([data-selected])]:text-dark-unodashboard-content',
                // brand
                color
                    ? getColorClassNames(color, colorPalette.border).selectBorderColor
                    : [
                          'data-selected:border-unodashboard-brand data-selected:text-unodashboard-brand',
                          'dark:data-selected:border-dark-unodashboard-brand dark:data-selected:text-dark-unodashboard-brand',
                      ],
            );
        case 'solid':
            return unoTwMerge(
                // common
                'border-transparent border rounded-unodashboard-small px-2.5 py-1',
                // light
                'data-selected:border-unodashboard-border data-selected:bg-unodashboard-background data-selected:shadow-unodashboard-input [&:not([data-selected])]:hover:text-unodashboard-content-emphasis data-selected:text-unodashboard-brand [&:not([data-selected])]:text-unodashboard-content',
                // dark
                'dark:data-selected:border-dark-unodashboard-border dark:data-selected:bg-dark-unodashboard-background dark:data-selected:shadow-dark-unodashboard-input dark:[&:not([data-selected])]:hover:text-dark-unodashboard-content-emphasis dark:data-selected:text-dark-unodashboard-brand dark:[&:not([data-selected])]:text-dark-unodashboard-content',
                // brand
                color
                    ? getColorClassNames(color, colorPalette.text).selectTextColor
                    : 'text-unodashboard-content dark:text-dark-unodashboard-content',
            );
    }
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ElementType;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(({ icon, className, children, ...other }, ref) => {
    const variant = useContext(TabVariantContext);
    const color = useContext(BaseColorContext);
    const Icon = icon;

    return (
        <HeadlessTab
            ref={ref}
            className={unoTwMerge(
                makeTabClassName('root'),
                // common
                'flex whitespace-nowrap truncate max-w-xs outline-hidden data-focus-visible:ring-3 text-unodashboard-default transition duration-100',
                getVariantStyles(variant, color),
                className,
                color && getColorClassNames(color, colorPalette.text).selectTextColor,
            )}
            {...other}
        >
            {Icon ? (
                <Icon className={unoTwMerge(makeTabClassName('icon'), 'flex-none h-5 w-5', children ? 'mr-2' : '')} />
            ) : null}
            {children ? <span>{children}</span> : null}
        </HeadlessTab>
    );
});
