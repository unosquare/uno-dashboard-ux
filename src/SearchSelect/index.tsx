import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from '@headlessui/react';
import React, { useRef, useMemo, isValidElement } from 'react';
import { useInternalState } from '../hooks';
import { ArrowDownHeadIcon, XCircleIcon, constructValueToNameMapping, getFilteredOptions } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeSearchSelectItemClassName = makeClassName('SearchSelectItem');

export interface SearchSelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    icon?: React.ElementType;
}

export const SearchSelectItem = React.forwardRef<HTMLDivElement, SearchSelectItemProps>(
    ({ value, icon, className, children, ...other }, ref) => {
        const Icon = icon;

        return (
            <ComboboxOption
                className={tremorTwMerge(
                    makeSearchSelectItemClassName('root'),
                    // common
                    'flex justify-start items-center cursor-default text-tremor-default p-2.5',
                    // light
                    'data-[focus]:bg-tremor-background-muted  data-[focus]:text-tremor-content-strong data-[selected]:text-tremor-content-strong data-[selected]:bg-tremor-background-muted text-tremor-content-emphasis',
                    // dark
                    'dark:data-[focus]:bg-dark-tremor-background-muted  dark:data-[focus]:text-dark-tremor-content-strong dark:data-[selected]:text-dark-tremor-content-strong dark:data-[selected]:bg-dark-tremor-background-muted dark:text-dark-tremor-content-emphasis',
                    className,
                )}
                ref={ref}
                key={value}
                value={value}
                {...other}
            >
                {Icon && (
                    <Icon
                        className={tremorTwMerge(
                            makeSearchSelectItemClassName('icon'),
                            // common
                            'flex-none h-5 w-5 mr-3',
                            // light
                            'text-tremor-content-subtle',
                            // dark
                            'dark:text-dark-tremor-content-subtle',
                        )}
                    />
                )}
                <span className='whitespace-nowrap truncate'>{children ?? value}</span>
            </ComboboxOption>
        );
    },
);

const makeSearchSelectClassName = makeClassName('SearchSelect');

export interface SearchSelectProps extends React.HTMLAttributes<HTMLInputElement> {
    defaultValue?: string;
    name?: string;
    searchValue?: string;
    onSearchValueChange?: (value: string) => void;
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon?: React.ElementType | React.JSXElementConstructor<any>;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    enableClear?: boolean;
    children: React.ReactNode;
    autoComplete?: string;
}

const makeSelectClassName = makeClassName('SearchSelect');

export const SearchSelect = React.forwardRef<HTMLInputElement, SearchSelectProps>(
    (
        {
            defaultValue = '',
            searchValue,
            onSearchValueChange,
            value,
            onValueChange,
            placeholder = 'Select...',
            disabled = false,
            icon,
            enableClear = true,
            name,
            required,
            error = false,
            errorMessage,
            children,
            className,
            id,
            autoComplete = 'off',
            ...other
        },
        ref,
    ) => {
        const comboboxInputRef = useRef<HTMLInputElement | null>(null);

        const [searchQuery, setSearchQuery] = useInternalState('', searchValue);
        const [selectedValue, setSelectedValue] = useInternalState(defaultValue, value);

        const Icon = icon;

        const { reactElementChildren, valueToNameMapping } = useMemo(() => {
            const reactElementChildren = React.Children.toArray(children).filter(isValidElement);
            const valueToNameMapping = constructValueToNameMapping(reactElementChildren);
            return { reactElementChildren, valueToNameMapping };
        }, [children]);

        const filteredOptions = useMemo(
            () => getFilteredOptions(searchQuery ?? '', reactElementChildren),
            [searchQuery, reactElementChildren],
        );

        const handleReset = () => {
            setSelectedValue('');
            setSearchQuery('');
            onValueChange?.('');
            onSearchValueChange?.('');
        };

        return (
            <div
                className={tremorTwMerge(
                    // common
                    'w-full min-w-[10rem] text-tremor-default',
                    className,
                )}
            >
                <div className='relative'>
                    <select
                        title='search-select-hidden'
                        required={required}
                        className={tremorTwMerge('h-full w-full absolute left-0 top-0 -z-10 opacity-0')}
                        value={selectedValue}
                        onChange={(e) => {
                            e.preventDefault();
                        }}
                        name={name}
                        disabled={disabled}
                        id={id}
                        onFocus={() => {
                            const comboboxInput = comboboxInputRef.current;
                            if (comboboxInput) comboboxInput.focus();
                        }}
                    >
                        <option className='hidden' value='' disabled hidden>
                            {placeholder}
                        </option>
                        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                        {filteredOptions.map((child: any) => (
                            <option className='hidden' key={child.props.value} value={child.props.value}>
                                {child.props.children}
                            </option>
                        ))}
                    </select>
                    <Combobox
                        as='div'
                        ref={ref}
                        defaultValue={selectedValue}
                        value={selectedValue}
                        onChange={
                            ((value: string) => {
                                onValueChange?.(value);
                                setSelectedValue(value);
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            }) as any
                        }
                        disabled={disabled}
                        id={id}
                        {...other}
                    >
                        {({ value }) => (
                            <>
                                <ComboboxButton className='w-full'>
                                    {Icon && (
                                        <span
                                            className={tremorTwMerge(
                                                'absolute inset-y-0 left-0 flex items-center ml-px pl-2.5',
                                            )}
                                        >
                                            <Icon
                                                className={tremorTwMerge(
                                                    makeSearchSelectClassName('Icon'),
                                                    // common
                                                    'flex-none h-5 w-5',
                                                    // light
                                                    'text-tremor-content-subtle',
                                                    // dark
                                                    'dark:text-dark-tremor-content-subtle',
                                                )}
                                            />
                                        </span>
                                    )}

                                    <ComboboxInput
                                        ref={comboboxInputRef}
                                        className={tremorTwMerge(
                                            // common
                                            'w-full outline-none text-left whitespace-nowrap truncate rounded-tremor-default focus:ring-2 transition duration-100 text-tremor-default pr-14 border py-2',
                                            // light
                                            'border-tremor-border shadow-tremor-input focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
                                            // dark
                                            'dark:border-dark-tremor-border dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle dark:focus:ring-dark-tremor-brand-muted',
                                            Icon ? 'pl-10' : 'pl-3',
                                            disabled
                                                ? 'placeholder:text-tremor-content-subtle dark:placeholder:text-tremor-content-subtle'
                                                : 'placeholder:text-tremor-content dark:placeholder:text-tremor-content',
                                            getSelectButtonColors(hasValue(value), disabled, error),
                                        )}
                                        placeholder={placeholder}
                                        onChange={(event) => {
                                            onSearchValueChange?.(event.target.value);
                                            setSearchQuery(event.target.value);
                                        }}
                                        displayValue={(value: string) => valueToNameMapping.get(value) ?? ''}
                                        autoComplete={autoComplete}
                                    />
                                    <div
                                        className={tremorTwMerge('absolute inset-y-0 right-0 flex items-center pr-2.5')}
                                    >
                                        <ArrowDownHeadIcon
                                            className={tremorTwMerge(
                                                makeSearchSelectClassName('arrowDownIcon'),
                                                // common
                                                'flex-none h-5 w-5',
                                                // light
                                                '!text-tremor-content-subtle',
                                                // dark
                                                '!dark:text-dark-tremor-content-subtle',
                                            )}
                                        />
                                    </div>
                                </ComboboxButton>

                                {enableClear && selectedValue ? (
                                    <button
                                        type='button'
                                        className={tremorTwMerge('absolute inset-y-0 right-0 flex items-center mr-8')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleReset();
                                        }}
                                    >
                                        <XCircleIcon
                                            className={tremorTwMerge(
                                                makeSelectClassName('clearIcon'),
                                                // common
                                                'flex-none h-4 w-4',
                                                // light
                                                'text-tremor-content-subtle',
                                                // dark
                                                'dark:text-dark-tremor-content-subtle',
                                            )}
                                        />
                                    </button>
                                ) : null}
                                {filteredOptions.length > 0 && (
                                    <Transition
                                        enter='transition ease duration-100 transform'
                                        enterFrom='opacity-0 -translate-y-4'
                                        enterTo='opacity-100 translate-y-0'
                                        leave='transition ease duration-100 transform'
                                        leaveFrom='opacity-100 translate-y-0'
                                        leaveTo='opacity-0 -translate-y-4'
                                    >
                                        <ComboboxOptions
                                            anchor='bottom start'
                                            className={tremorTwMerge(
                                                // common
                                                'z-10 divide-y w-[var(--button-width)] overflow-y-auto outline-none rounded-tremor-default text-tremor-default max-h-[228px] border [--anchor-gap:4px]',
                                                // light
                                                'bg-tremor-background border-tremor-border divide-tremor-border shadow-tremor-dropdown',
                                                // dark
                                                'dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border dark:shadow-dark-tremor-dropdown',
                                            )}
                                        >
                                            {filteredOptions}
                                        </ComboboxOptions>
                                    </Transition>
                                )}
                            </>
                        )}
                    </Combobox>
                </div>
                {error && errorMessage ? (
                    <p className={tremorTwMerge('errorMessage', 'text-sm text-rose-500 mt-1')}>{errorMessage}</p>
                ) : null}
            </div>
        );
    },
);
