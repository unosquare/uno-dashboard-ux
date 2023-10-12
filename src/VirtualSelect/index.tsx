import React, { useMemo, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { ReactSelectOption } from '../Select';
import { spacing } from '@tremor/react/dist/lib/spacing';
import { sizing } from '@tremor/react/dist/lib/sizing';
import { border } from '@tremor/react/dist/lib/shape';
import { makeClassName } from '@tremor/react/dist/lib/utils';
import { getSelectButtonColors, hasValue } from '@tremor/react/dist/components/input-elements/selectUtils';

export interface SearchSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    icon?: React.ElementType | React.JSXElementConstructor<unknown>;
    options: ReactSelectOption<string | number>[];
}

export interface IconSettings extends React.HTMLAttributes<HTMLDivElement> {
    icon: React.ElementType | React.JSXElementConstructor<unknown>;
}

const makeSearchSelectClassName = makeClassName('SearchSelect');

const makeSearchSelectItemClassName = makeClassName('SearchSelectItem');

const getFilteredOptions = (searchQuery: string, options: ReactSelectOption<string | number>[]) =>
    searchQuery === '' || searchQuery.length < 3
        ? options
        : options.filter(({ label }) => label.toLowerCase().includes(searchQuery.toLowerCase()));

const constructValueToNameMapping = (options: ReactSelectOption<string | number>[]) => {
    const valueToNameMapping = new Map<string, string>();
    options.forEach(({ value, label }) => {
        valueToNameMapping.set(value.toString(), label);
    });
    return valueToNameMapping;
};

export const comboBoxStyles = <T,>(value: T, disabled: boolean, icon: boolean) =>
    tremorTwMerge(
        'w-full outline-none text-left whitespace-nowrap truncate rounded-tremor-default focus:ring-2 transition duration-100 text-tremor-default',
        'border-tremor-border shadow-tremor-input focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
        'dark:border-dark-tremor-border dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle dark:focus:ring-dark-tremor-brand-muted',
        icon ? 'p-10 -ml-0.5' : spacing.lg.paddingLeft,
        spacing.fourXl.paddingRight,
        spacing.sm.paddingY,
        border.sm.all,
        disabled
            ? 'placeholder:text-tremor-content-subtle dark:placeholder:text-tremor-content-subtle'
            : 'placeholder:text-tremor-content dark:placeholder:text-tremor-content',
        getSelectButtonColors(hasValue(value), disabled),
    );

export const comboBoxOptionsStyles = tremorTwMerge(
    'absolute overflow-y-auto overflow-x-hidden block z-10 divide-y max-h-[228px] w-full left-0 outline-none rounded-tremor-default text-tremor-default',
    'bg-tremor-background border-tremor-border divide-tremor-border shadow-tremor-dropdown',
    'dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border dark:shadow-dark-tremor-dropdown',
    spacing.twoXs.marginTop,
    spacing.twoXs.marginBottom,
    border.sm.all,
);

export const comboBoxSingleOptionStyles = (className: string | undefined) =>
    tremorTwMerge(
        makeSearchSelectItemClassName('root'),
        'flex justify-start items-center w-full cursor-default text-tremor-default border-t-[1px]',
        'ui-active:bg-tremor-background-muted  ui-active:text-tremor-content-strong ui-selected:text-tremor-content-strong ui-selected:bg-tremor-background-muted text-tremor-content-emphasis border-t-gray-200',
        'dark:ui-active:bg-dark-tremor-background-muted  dark:ui-active:text-dark-tremor-content-strong dark:ui-selected:text-dark-tremor-content-strong dark:ui-selected:bg-dark-tremor-background-muted dark:text-dark-tremor-content-emphasis dark:border-t-gray-800',
        spacing.md.paddingX,
        spacing.md.paddingY,
        className,
    );

export const IconSearch = ({ icon }: IconSettings) => {
    const Icon = icon;

    return (
        <span className={tremorTwMerge('absolute inset-y-0 left-0 flex items-center ml-px', spacing.md.paddingLeft)}>
            <Icon
                className={tremorTwMerge(
                    makeSearchSelectClassName('Icon'),
                    'flex-none',
                    'text-tremor-content-subtle',
                    'dark:text-dark-tremor-content-subtle',
                    sizing.lg.height,
                    sizing.lg.width,
                )}
            />
        </span>
    );
};

const ArrowDownHeadIcon = ({ ...props }) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2.5'
    >
        <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
    </svg>
);

export const ArrowDownHead = () => (
    <div className={tremorTwMerge('absolute inset-y-0 right-0 flex items-center', spacing.md.paddingRight)}>
        <ArrowDownHeadIcon
            className={tremorTwMerge(
                makeSearchSelectClassName('arrowDownIcon'),
                'flex-none',
                'text-tremor-content-subtle',
                'dark:text-dark-tremor-content-subtle',
                sizing.md.height,
                sizing.md.width,
            )}
        />
    </div>
);

export const VirtualSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(function SearchSelect(props, ref) {
    const {
        value,
        onValueChange,
        placeholder = 'Select...',
        disabled = false,
        icon,
        className,
        options,
        ...other
    } = props;

    const [searchQuery, setSearchQuery] = useState('');

    const valueToNameMapping = useMemo(() => constructValueToNameMapping(options), [options]);
    const filteredOptions = useMemo(() => getFilteredOptions(searchQuery, options), [searchQuery, options]);

    return (
        <Combobox
            {...other}
            virtual={{
                options: filteredOptions.map((x) => x.value.toString()),
                disabled: (option) => option === value,
            }}
            as='div'
            ref={ref}
            value={value}
            onChange={onValueChange}
            disabled={disabled}
            className={tremorTwMerge('w-full min-w-[10rem] relative text-tremor-default', className)}
        >
            <Combobox.Button className='w-full'>
                {icon && <IconSearch icon={icon} />}

                <Combobox.Input
                    className={comboBoxStyles(value, disabled, !!icon)}
                    placeholder={placeholder}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    displayValue={(selected: string) => valueToNameMapping.get(selected) ?? ''}
                />
                <ArrowDownHead />
            </Combobox.Button>
            <Combobox.Options className={comboBoxOptionsStyles}>
                {({ option }) => (
                    <Combobox.Option className={comboBoxSingleOptionStyles(className)} value={option as string}>
                        <span className='whitespace-nowrap truncate'>{valueToNameMapping.get(option as string)}</span>
                    </Combobox.Option>
                )}
            </Combobox.Options>
        </Combobox>
    );
});
