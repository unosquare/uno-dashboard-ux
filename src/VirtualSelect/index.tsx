import React, { useEffect, useMemo, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { makeClassName } from '@tremor/react/dist/lib/utils';
import { getSelectButtonColors, hasValue } from '@tremor/react/dist/components/input-elements/selectUtils';
import { ChevronDown16Filled, DismissCircle16Filled } from '@fluentui/react-icons';
import { useDebounce } from '../hooks';
import { ReactSelectOption } from '../constants';

export interface SearchSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    options: ReactSelectOption<string | number>[];
    enableClear?: boolean;
}

export interface IconSettings extends React.HTMLAttributes<HTMLDivElement> {
    icon: React.ElementType | React.JSXElementConstructor<unknown>;
}

const makeSearchSelectClassName = makeClassName('SearchSelect');

const makeSearchSelectItemClassName = makeClassName('SearchSelectItem');

const getValues = (options: ReactSelectOption<string | number>[]) => options.map((x) => x.value.toString());

const getFilteredOptions = (searchQuery: string | undefined, options: ReactSelectOption<string | number>[]) =>
    getValues(
        !searchQuery || searchQuery.length < 3
            ? options
            : options.filter(({ label }) => label.toLowerCase().includes(searchQuery.toLowerCase())),
    );

const constructValueToNameMapping = (options: ReactSelectOption<string | number>[]) => {
    const valueToNameMapping = new Map<string, string>();
    options.forEach(({ value, label }) => {
        valueToNameMapping.set(value.toString(), label);
    });
    return valueToNameMapping;
};

export const comboBoxStyles = <T,>(value: T, disabled: boolean, icon: boolean, showAsValue: boolean) =>
    tremorTwMerge(
        'w-full outline-none text-left whitespace-nowrap truncate rounded-tremor-default focus:ring-2 transition duration-100 text-tremor-default',
        'border-tremor-border shadow-tremor-input focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
        'dark:border-dark-tremor-border dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle dark:focus:ring-dark-tremor-brand-muted',
        'pl-3',
        icon ? 'pl-3 pr-12' : 'pr-8',
        'py-2',
        'border',
        showAsValue
            ? 'placeholder:text-tremor-content-emphasis'
            : 'placeholder:text-tremor-content dark:placeholder:text-tremor-content',
        disabled && 'placeholder:text-tremor-content-subtle dark:placeholder:text-tremor-content-subtle',
        getSelectButtonColors(hasValue(value), disabled),
    );

export const comboBoxOptionsStyles = tremorTwMerge(
    'absolute overflow-y-auto overflow-x-hidden block z-10 divide-y max-h-[228px] w-full left-0 outline-none rounded-tremor-default text-tremor-default',
    'bg-tremor-background border-tremor-border divide-tremor-border shadow-tremor-dropdown',
    'dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border dark:shadow-dark-tremor-dropdown',
    'mt-1 mb-1 border',
);

export const comboBoxSingleOptionStyles = (className: string | undefined) =>
    tremorTwMerge(
        makeSearchSelectItemClassName('root'),
        'flex justify-start items-center w-full cursor-default text-tremor-default border-t-[1px]',
        'ui-active:bg-tremor-background-muted  ui-active:text-tremor-content-strong ui-selected:text-tremor-content-strong ui-selected:bg-tremor-background-muted text-tremor-content-emphasis border-t-gray-200',
        'dark:ui-active:bg-dark-tremor-background-muted  dark:ui-active:text-dark-tremor-content-strong dark:ui-selected:text-dark-tremor-content-strong dark:ui-selected:bg-dark-tremor-background-muted dark:text-dark-tremor-content-emphasis dark:border-t-gray-800',
        'px-2.5 py-2.5',
        className,
        'my-0',
    );

const ArrowDownHead = () => (
    <div className='absolute inset-y-0 right-0 flex items-center pr-2.5'>
        <ChevronDown16Filled
            className={tremorTwMerge(
                makeSearchSelectClassName('arrowDownIcon'),
                'flex-none',
                'text-tremor-content-subtle',
                'dark:text-dark-tremor-content-subtle',
            )}
        />
    </div>
);

const SelectClearButton = ({ clearValue }: { clearValue: (e: string) => void }) => (
    <button type='button' className='absolute inset-y-0 right-0 flex items-center mr-8' onClick={() => clearValue('')}>
        <DismissCircle16Filled className='flex-none text-tremor-content-subtle dark:text-dark-tremor-content-subtle' />
    </button>
);

export const VirtualSelect = React.forwardRef<HTMLDivElement, SearchSelectProps>(function SearchSelect(props, ref) {
    const {
        value,
        onValueChange,
        placeholder = 'Select...',
        disabled = false,
        className,
        enableClear,
        options,
        ...other
    } = props;

    const [searchQuery, setSearchQuery] = useState<string>();
    const [filteredOptions, setFilteredOptions] = useState<string[]>(getValues(options));

    const valueToNameMapping = useMemo(() => constructValueToNameMapping(options), [options]);

    useEffect(() => setFilteredOptions(getValues(options)), [options]);

    const debouncedSearch = useDebounce(() => {
        setFilteredOptions(getFilteredOptions(searchQuery, options));
    }, 300);

    const onOptionClick = (option: string) => () => onValueChange(option);

    const performSearch = (x: string) => {
        setSearchQuery(x);
        debouncedSearch();
    };

    const onSearchInternal = ({ target }: React.ChangeEvent<HTMLInputElement>) => performSearch(target.value ?? '');

    const onClearSearch = () => performSearch('');

    return (
        <Combobox
            {...other}
            virtual={{
                options: filteredOptions ?? [],
            }}
            as='div'
            value={searchQuery}
            ref={ref}
            disabled={disabled}
            onChange={() => setSearchQuery('')}
            className={tremorTwMerge('w-full min-w-[10rem] relative text-tremor-default', className)}
        >
            <ComboboxButton className='w-full'>
                <ComboboxInput
                    className={comboBoxStyles(value, disabled, !!enableClear && !!value, !searchQuery && !!value)}
                    placeholder={valueToNameMapping.get(value ?? '') ?? placeholder}
                    onBlur={onClearSearch}
                    onChange={onSearchInternal}
                    displayValue={() => searchQuery ?? ''}
                />
                <ArrowDownHead />
            </ComboboxButton>
            {enableClear && !!value && <SelectClearButton clearValue={onValueChange} />}
            <ComboboxOptions className={comboBoxOptionsStyles} hold>
                {({ option }) => (
                    <ComboboxOption
                        className={comboBoxSingleOptionStyles(className)}
                        value={option as string}
                        onClick={onOptionClick(option as string)}
                    >
                        <span className='whitespace-nowrap truncate'>{valueToNameMapping.get(option as string)}</span>
                    </ComboboxOption>
                )}
            </ComboboxOptions>
        </Combobox>
    );
});
