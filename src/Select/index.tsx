import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import React, { Children, isValidElement, useMemo, useRef } from 'react';
import { useInternalState } from '../hooks';
import { ArrowDownHeadIcon, constructValueToNameMapping, XCircleIcon } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeSelectClassName = makeClassName('Select');

export interface SelectProps extends React.HTMLAttributes<HTMLInputElement> {
    value?: string;
    name?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    icon?: React.JSXElementConstructor<any>;
    enableClear?: boolean;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
    (
        {
            defaultValue = '',
            value,
            onValueChange,
            placeholder = 'Select...',
            disabled = false,
            icon,
            enableClear = false,
            required,
            children,
            name,
            error = false,
            errorMessage,
            className,
            id,
            ...other
        },
        ref,
    ) => {
        const listboxButtonRef = useRef<HTMLButtonElement | null>(null);
        const childrenArray = Children.toArray(children);

        const [selectedValue, setSelectedValue] = useInternalState(defaultValue, value);
        const Icon = icon;
        const valueToNameMapping = useMemo(() => {
            const reactElementChildren = React.Children.toArray(children).filter(isValidElement);
            return constructValueToNameMapping(reactElementChildren);
        }, [children]);

        const handleReset = () => {
            setSelectedValue('');
            onValueChange?.('');
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
                        title='select-hidden'
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
                            const listboxButton = listboxButtonRef.current;
                            if (listboxButton) listboxButton.focus();
                        }}
                    >
                        <option className='hidden' value='' disabled hidden>
                            {placeholder}
                        </option>
                        {childrenArray.map((child: any) => {
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
                                <ListboxButton
                                    ref={listboxButtonRef}
                                    className={unoTwMerge(
                                        // common
                                        'w-full outline-hidden text-left whitespace-nowrap truncate rounded-unodashboard-default focus:ring-2 transition duration-100 border pr-8 py-2',
                                        // light
                                        'border-unodashboard-border shadow-unodashboard-input focus:border-unodashboard-brand-subtle focus:ring-unodashboard-brand-muted',
                                        // dark
                                        'dark:border-dark-unodashboard-border dark:shadow-dark-unodashboard-input dark:focus:border-dark-unodashboard-brand-subtle dark:focus:ring-dark-unodashboard-brand-muted',
                                        Icon ? 'pl-10' : 'pl-3',
                                        getSelectButtonColors(hasValue(value), disabled, error),
                                    )}
                                >
                                    {Icon && (
                                        <span
                                            className={unoTwMerge(
                                                'absolute inset-y-0 left-0 flex items-center ml-px pl-2.5',
                                            )}
                                        >
                                            <Icon
                                                className={unoTwMerge(
                                                    makeSelectClassName('Icon'),
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
                                    <span className='w-[90%] block truncate'>
                                        {value ? (valueToNameMapping.get(value) ?? placeholder) : placeholder}
                                    </span>
                                    <span className={unoTwMerge('absolute inset-y-0 right-0 flex items-center mr-3')}>
                                        <ArrowDownHeadIcon
                                            className={unoTwMerge(
                                                makeSelectClassName('arrowDownIcon'),
                                                // common
                                                'flex-none h-5 w-5',
                                                // light
                                                'text-unodashboard-content-subtle',
                                                // dark
                                                'dark:text-dark-unodashboard-content-subtle',
                                            )}
                                        />
                                    </span>
                                </ListboxButton>
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
                                        className={unoTwMerge(
                                            // common
                                            'z-10 w-[var(--button-width)] divide-y overflow-y-auto outline-hidden rounded-unodashboard-default max-h-[228px]  border [--anchor-gap:4px]',
                                            // light
                                            'bg-unodashboard-background border-unodashboard-border divide-unodashboard-border shadow-unodashboard-dropdown',
                                            // dark
                                            'dark:bg-dark-unodashboard-background dark:border-dark-unodashboard-border dark:divide-dark-unodashboard-border dark:shadow-dark-unodashboard-dropdown',
                                        )}
                                    >
                                        {children}
                                    </ListboxOptions>
                                </Transition>
                            </>
                        )}
                    </Listbox>
                </div>
                {error && errorMessage ? (
                    <p className={unoTwMerge('errorMessage', 'text-sm text-rose-500 mt-1')}>{errorMessage}</p>
                ) : null}
            </div>
        );
    },
);

const makeSelectItemClassName = makeClassName('SelectItem');

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    icon?: React.ElementType;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ value, icon, className, children }, ref) => {
        const Icon = icon;

        return (
            <ListboxOption
                className={unoTwMerge(
                    makeSelectItemClassName('root'),
                    // common
                    'flex justify-start items-center cursor-default text-unodashboard-default px-2.5 py-2.5',
                    // light
                    'data-focus:bg-unodashboard-background-muted  data-focus:text-unodashboard-content-strong data-selected:text-unodashboard-content-strong data-selected:bg-unodashboard-background-muted text-unodashboard-content-emphasis',
                    // dark
                    'dark:data-focus:bg-dark-unodashboard-background-muted  dark:data-focus:text-dark-unodashboard-content-strong dark:data-selected:text-dark-unodashboard-content-strong dark:data-selected:bg-dark-unodashboard-background-muted dark:text-dark-unodashboard-content-emphasis',
                    className,
                )}
                ref={ref}
                key={value}
                value={value}
            >
                {Icon && (
                    <Icon
                        className={unoTwMerge(
                            makeSelectItemClassName('icon'),
                            // common
                            'flex-none w-5 h-5 mr-1.5',
                            // light
                            'text-unodashboard-content-subtle',
                            // dark
                            'dark:text-dark-unodashboard-content-subtle',
                        )}
                    />
                )}
                <span className='whitespace-nowrap truncate'>{children ?? value}</span>
            </ListboxOption>
        );
    },
);
