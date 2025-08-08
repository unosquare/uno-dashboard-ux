import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from '@headlessui/react';
import React, { isValidElement, useMemo, useRef } from 'react';
import { useInternalState } from '../hooks';
import { ArrowDownHeadIcon, constructValueToNameMapping, getFilteredOptions, XCircleIcon } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

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
                className={unoTwMerge(
                    makeSearchSelectItemClassName('root'),
                    // common
                    'flex justify-start items-center cursor-default text-unodashboard-default p-2.5',
                    // light
                    'data-focus:bg-unodashboard-background-muted  data-focus:text-unodashboard-content-strong data-selected:text-unodashboard-content-strong data-selected:bg-unodashboard-background-muted text-unodashboard-content-emphasis',
                    // dark
                    'dark:data-focus:bg-dark-unodashboard-background-muted  dark:data-focus:text-dark-unodashboard-content-strong dark:data-selected:text-dark-unodashboard-content-strong dark:data-selected:bg-dark-unodashboard-background-muted dark:text-dark-unodashboard-content-emphasis',
                    className,
                )}
                ref={ref}
                key={value}
                value={value}
                {...other}
            >
                {Icon && (
                    <Icon
                        className={unoTwMerge(
                            makeSearchSelectItemClassName('icon'),
                            // common
                            'flex-none h-5 w-5 mr-3',
                            // light
                            'text-unodashboard-content-subtle',
                            // dark
                            'dark:text-dark-unodashboard-content-subtle',
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
                className={unoTwMerge(
                    // common
                    'w-full min-w-[10rem] text-unodashboard-default',
                    className,
                )}
            >
                <div className='relative'>
                    <select
                        title='search-select-hidden'
                        required={required}
                        className={unoTwMerge('h-full w-full absolute left-0 top-0 -z-10 opacity-0')}
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
                                            className={unoTwMerge(
                                                'absolute inset-y-0 left-0 flex items-center ml-px pl-2.5',
                                            )}
                                        >
                                            <Icon
                                                className={unoTwMerge(
                                                    makeSearchSelectClassName('Icon'),
                                                    // common
                                                    'flex-none h-5 w-5',
                                                    // light
                                                    'text-unodashboard-content-subtle',
                                                    // dark
                                                    'dark:text-dark-unodashboard-content-subtle',
                                                )}
                                            />
                                        </span>
                                    )}

                                    <ComboboxInput
                                        ref={comboboxInputRef}
                                        className={unoTwMerge(
                                            // common
                                            'w-full outline-hidden text-left whitespace-nowrap truncate rounded-unodashboard-default focus:ring-2 transition duration-100 text-unodashboard-default pr-14 border py-2',
                                            // light
                                            'border-unodashboard-border shadow-unodashboard-input focus:border-unodashboard-brand-subtle focus:ring-unodashboard-brand-muted',
                                            // dark
                                            'dark:border-dark-unodashboard-border dark:shadow-dark-unodashboard-input dark:focus:border-dark-unodashboard-brand-subtle dark:focus:ring-dark-unodashboard-brand-muted',
                                            Icon ? 'pl-10' : 'pl-3',
                                            disabled
                                                ? 'placeholder:text-unodashboard-content-subtle dark:placeholder:text-unodashboard-content-subtle'
                                                : 'placeholder:text-unodashboard-content dark:placeholder:text-unodashboard-content',
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
                                    <div className={unoTwMerge('absolute inset-y-0 right-0 flex items-center pr-2.5')}>
                                        <ArrowDownHeadIcon
                                            className={unoTwMerge(
                                                makeSearchSelectClassName('arrowDownIcon'),
                                                // common
                                                'flex-none h-5 w-5',
                                                // light
                                                'text-unodashboard-content-subtle!',
                                                // dark
                                                '!dark:text-dark-unodashboard-content-subtle',
                                            )}
                                        />
                                    </div>
                                </ComboboxButton>

                                {enableClear && selectedValue ? (
                                    <button
                                        type='button'
                                        className={unoTwMerge('absolute inset-y-0 right-0 flex items-center mr-8')}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleReset();
                                        }}
                                    >
                                        <XCircleIcon
                                            className={unoTwMerge(
                                                makeSelectClassName('clearIcon'),
                                                // common
                                                'flex-none h-4 w-4',
                                                // light
                                                'text-unodashboard-content-subtle',
                                                // dark
                                                'dark:text-dark-unodashboard-content-subtle',
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
                                            className={unoTwMerge(
                                                // common
                                                'z-10 divide-y w-[var(--button-width)] overflow-y-auto outline-hidden rounded-unodashboard-default text-unodashboard-default max-h-[228px] border [--anchor-gap:4px]',
                                                // light
                                                'bg-unodashboard-background border-unodashboard-border divide-unodashboard-border shadow-unodashboard-dropdown',
                                                // dark
                                                'dark:bg-dark-unodashboard-background dark:border-dark-unodashboard-border dark:divide-dark-unodashboard-border dark:shadow-dark-unodashboard-dropdown',
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
                    <p className={unoTwMerge('errorMessage', 'text-sm text-rose-500 mt-1')}>{errorMessage}</p>
                ) : null}
            </div>
        );
    },
);
