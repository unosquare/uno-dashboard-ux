import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import React, { useRef, useMemo, isValidElement, useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useInternalState } from '../hooks';
import { ArrowDownHeadIcon, XCircleIcon, getFilteredOptions } from '../reactUtils';
import { getSelectButtonColors, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';
import { isValueInArray } from '../utils';

const makeMultiSelectItemClassName = makeClassName('MultiSelectItem');

export interface MultiSelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

export const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
    ({ value, className, children }, ref) => {
        const { selectedValue } = useContext(SelectedValueContext);
        const isSelected = isValueInArray(value, selectedValue);

        return (
            <ListboxOption
                className={tremorTwMerge(
                    makeMultiSelectItemClassName('root'),
                    // common
                    'flex justify-start items-center cursor-default text-tremor-default p-2.5',
                    // light
                    // "data-[focus]:bg-tremor-background-muted data-[focus]:text-tremor-content-strong data-[select]ed:text-tremor-content-strong data-[select]ed:bg-tremor-background-muted text-tremor-content-emphasis",
                    'data-[focus]:bg-tremor-background-muted data-[focus]:text-tremor-content-strong data-[select]ed:text-tremor-content-strong text-tremor-content-emphasis',
                    // dark
                    'dark:data-[focus]:bg-dark-tremor-background-muted dark:data-[focus]:text-dark-tremor-content-strong dark:data-[select]ed:text-dark-tremor-content-strong dark:data-[select]ed:bg-dark-tremor-background-muted dark:text-dark-tremor-content-emphasis',
                    className,
                )}
                ref={ref}
                key={value}
                value={value}
            >
                <input
                    type='checkbox'
                    className={tremorTwMerge(
                        makeMultiSelectItemClassName('checkbox'),
                        // common
                        'flex-none focus:ring-none focus:outline-none cursor-pointer mr-2.5',
                        // light
                        'accent-tremor-brand',
                        // dark
                        'dark:accent-dark-tremor-brand',
                    )}
                    checked={isSelected}
                    readOnly={true}
                />
                <span className='whitespace-nowrap truncate'>{children ?? value}</span>
            </ListboxOption>
        );
    },
);

const makeMultiSelectClassName = makeClassName('MultiSelect');

interface SelectedValueContextValue {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    selectedValue: any;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    handleValueChange?: (value: any) => void;
}

const SelectedValueContext = createContext<SelectedValueContextValue>({
    selectedValue: undefined,
    handleValueChange: undefined,
});

const SearchIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Search</title>
        <path d='M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z' />
    </svg>
);

const XIcon = ({ ...props }) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100%'
        height='100%'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        {...props}
    >
        <title>X</title>
        <line x1='18' y1='6' x2='6' y2='18' />
        <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
);

export interface MultiSelectProps extends React.HTMLAttributes<HTMLInputElement> {
    defaultValue?: string[];
    name?: string;
    value?: string[];
    onValueChange?: (value: string[]) => void;
    placeholder?: string;
    placeholderSearch?: string;
    disabled?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon?: React.ElementType | React.JSXElementConstructor<any>;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    children: React.ReactNode;
}

export const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>((props, ref) => {
    const {
        defaultValue = [],
        value,
        onValueChange,
        placeholder = 'Select...',
        placeholderSearch = 'Search',
        disabled = false,
        icon,
        children,
        className,
        required,
        name,
        error = false,
        errorMessage,
        id,
        ...other
    } = props;
    const listboxButtonRef = useRef<HTMLButtonElement | null>(null);

    const Icon = icon;

    const [selectedValue, setSelectedValue] = useInternalState(defaultValue, value);

    const { reactElementChildren, optionsAvailable } = useMemo(() => {
        const reactElementChildren = React.Children.toArray(children).filter(isValidElement);
        const optionsAvailable = getFilteredOptions('', reactElementChildren);
        return { reactElementChildren, optionsAvailable };
    }, [children]);

    const [searchQuery, setSearchQuery] = useState('');

    // checked if there are selected options
    // used the same code from the previous version
    const selectedItems = selectedValue ?? [];
    const hasSelection = selectedItems.length > 0;

    const filteredOptions = useMemo(
        () => (searchQuery ? getFilteredOptions(searchQuery, reactElementChildren) : optionsAvailable),
        [searchQuery, reactElementChildren, optionsAvailable],
    );

    const handleReset = () => {
        setSelectedValue([]);
        onValueChange?.([]);
    };

    const handleResetSearch = () => {
        setSearchQuery('');
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
                    title='multi-select-hidden'
                    required={required}
                    className={tremorTwMerge('h-full w-full absolute left-0 top-0 -z-10 opacity-0')}
                    value={selectedValue}
                    onChange={(e) => {
                        e.preventDefault();
                    }}
                    name={name}
                    disabled={disabled}
                    multiple
                    id={id}
                    onFocus={() => {
                        const listboxButton = listboxButtonRef.current;
                        if (listboxButton) listboxButton.focus();
                    }}
                >
                    <option className='hidden' value='' disabled hidden>
                        {placeholder}
                    </option>
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    {filteredOptions.map((child: any) => {
                        const value = child.props.value;
                        const name = child.props.children;
                        return (
                            <option className='hidden' key={value} value={value}>
                                {name}
                            </option>
                        );
                    })}
                </select>
                <Listbox
                    as='div'
                    ref={ref}
                    defaultValue={selectedValue}
                    value={selectedValue}
                    onChange={
                        ((values: string[]) => {
                            onValueChange?.(values);
                            setSelectedValue(values);
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        }) as any
                    }
                    disabled={disabled}
                    id={id}
                    multiple
                    {...other}
                >
                    {({ value }) => (
                        <>
                            <ListboxButton
                                className={tremorTwMerge(
                                    // common
                                    'w-full outline-none text-left whitespace-nowrap truncate rounded-tremor-default focus:ring-2 transition duration-100 border pr-8 py-1.5',
                                    // light
                                    'border-tremor-border shadow-tremor-input focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
                                    // dark
                                    'dark:border-dark-tremor-border dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle dark:focus:ring-dark-tremor-brand-muted',
                                    Icon ? 'pl-11 -ml-0.5' : 'pl-3',
                                    getSelectButtonColors(value.length > 0, disabled, error),
                                )}
                                ref={listboxButtonRef}
                            >
                                {Icon && (
                                    <span
                                        className={tremorTwMerge(
                                            'absolute inset-y-0 left-0 flex items-center ml-px pl-2.5',
                                        )}
                                    >
                                        <Icon
                                            className={tremorTwMerge(
                                                makeMultiSelectClassName('Icon'),
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
                                <div className='h-6 flex items-center'>
                                    {value.length > 0 ? (
                                        <div className='flex flex-nowrap overflow-x-scroll [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-x-1 mr-5 -ml-1.5 relative'>
                                            {optionsAvailable
                                                .filter((option) => value.includes(option.props.value))
                                                .map((option) => {
                                                    return (
                                                        <div
                                                            key={uuidv4()}
                                                            className={tremorTwMerge(
                                                                'max-w-[100px] lg:max-w-[200px] flex justify-center items-center pl-2 pr-1.5 py-1 font-medium',
                                                                'rounded-tremor-small',
                                                                'bg-tremor-background-muted dark:bg-dark-tremor-background-muted',
                                                                'bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle',
                                                                'text-tremor-content-default dark:text-dark-tremor-content-default',
                                                                'text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis',
                                                            )}
                                                        >
                                                            <div className='text-xs truncate '>
                                                                {option.props.children ?? option.props.value}
                                                            </div>
                                                            <div
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    const newValue = value.filter(
                                                                        (v) => v !== option.props.value,
                                                                    );
                                                                    onValueChange?.(newValue);
                                                                    setSelectedValue(newValue);
                                                                }}
                                                            >
                                                                <XIcon
                                                                    className={tremorTwMerge(
                                                                        makeMultiSelectClassName('clearIconItem'),
                                                                        // common
                                                                        'cursor-pointer rounded-tremor-full w-3.5 h-3.5 ml-2',
                                                                        // light
                                                                        'text-tremor-content-subtle hover:text-tremor-content',
                                                                        // dark
                                                                        'dark:text-dark-tremor-content-subtle dark:hover:text-tremor-content',
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <span>{placeholder}</span>
                                    )}
                                </div>
                                <span className={tremorTwMerge('absolute inset-y-0 right-0 flex items-center mr-2.5')}>
                                    <ArrowDownHeadIcon
                                        className={tremorTwMerge(
                                            makeMultiSelectClassName('arrowDownIcon'),
                                            // common
                                            'flex-none h-5 w-5',
                                            // light
                                            'text-tremor-content-subtle',
                                            // dark
                                            'dark:text-dark-tremor-content-subtle',
                                        )}
                                    />
                                </span>
                            </ListboxButton>

                            {hasSelection && !disabled ? (
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
                                            makeMultiSelectClassName('clearIconAllItems'),
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
                            <Transition
                                enter='transition ease duration-100 transform'
                                enterFrom='opacity-0 -translate-y-4'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease duration-100 transform'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 -translate-y-4'
                            >
                                <ListboxOptions
                                    anchor='bottom start'
                                    className={tremorTwMerge(
                                        // common
                                        'z-10 divide-y w-[var(--button-width)] overflow-y-auto outline-none rounded-tremor-default max-h-[228px]  border [--anchor-gap:4px]',
                                        // light
                                        'bg-tremor-background border-tremor-border divide-tremor-border shadow-tremor-dropdown',
                                        // dark
                                        'dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border dark:shadow-dark-tremor-dropdown',
                                    )}
                                >
                                    <div
                                        className={tremorTwMerge(
                                            // common
                                            'flex items-center w-full px-2.5',
                                            // light
                                            'bg-tremor-background-muted',
                                            // dark
                                            'dark:bg-dark-tremor-background-muted',
                                        )}
                                    >
                                        <span>
                                            <SearchIcon
                                                className={tremorTwMerge(
                                                    // common
                                                    'flex-none w-4 h-4 mr-2',
                                                    // light
                                                    'text-tremor-content-subtle',
                                                    // dark
                                                    'dark:text-dark-tremor-content-subtle',
                                                )}
                                            />
                                        </span>
                                        <input
                                            name='search'
                                            type='input'
                                            autoComplete='off'
                                            placeholder={placeholderSearch}
                                            className={tremorTwMerge(
                                                // common
                                                'w-full focus:outline-none focus:ring-none bg-transparent text-tremor-default py-2',
                                                // light
                                                'text-tremor-content-emphasis',
                                                // dark
                                                'dark:text-dark-tremor-content-subtle',
                                            )}
                                            onKeyDown={(e) => {
                                                if (e.code === 'Space' && (e.target as HTMLInputElement).value !== '') {
                                                    e.stopPropagation();
                                                }
                                            }}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            value={searchQuery}
                                        />
                                    </div>
                                    <SelectedValueContext.Provider
                                        {...{ onBlur: { handleResetSearch } }}
                                        value={{ selectedValue: value }}
                                    >
                                        {filteredOptions}
                                    </SelectedValueContext.Provider>
                                </ListboxOptions>
                            </Transition>
                        </>
                    )}
                </Listbox>
            </div>
            {error && errorMessage ? (
                <p className={tremorTwMerge('errorMessage', 'text-sm text-rose-500 mt-1')}>{errorMessage}</p>
            ) : null}
        </div>
    );
});
