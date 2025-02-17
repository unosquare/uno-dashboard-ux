import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import React, { useRef, Children, useMemo, isValidElement } from 'react';
import { useInternalState } from '../hooks';
import { ArrowDownHeadIcon, XCircleIcon, constructValueToNameMapping } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

const makeSelectClassName = makeClassName('Select');

export interface SelectProps extends React.HTMLAttributes<HTMLInputElement> {
    value?: string;
    name?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon?: React.JSXElementConstructor<any>;
    enableClear?: boolean;
    required?: boolean;
    error?: boolean;
    errorMessage?: string;
    children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLInputElement, SelectProps>((props, ref) => {
    const {
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
    } = props;
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
            className={tremorTwMerge(
                // common
                'w-full min-w-[10rem] text-tremor-default',
                className,
            )}
        >
            <div className='relative'>
                <select
                    title='select-hidden'
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
                        const listboxButton = listboxButtonRef.current;
                        if (listboxButton) listboxButton.focus();
                    }}
                >
                    <option className='hidden' value='' disabled hidden>
                        {placeholder}
                    </option>
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
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
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
                                className={tremorTwMerge(
                                    // common
                                    'w-full outline-hidden text-left whitespace-nowrap truncate rounded-tremor-default focus:ring-2 transition duration-100 border pr-8 py-2',
                                    // light
                                    'border-tremor-border shadow-tremor-input focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
                                    // dark
                                    'dark:border-dark-tremor-border dark:shadow-dark-tremor-input dark:focus:border-dark-tremor-brand-subtle dark:focus:ring-dark-tremor-brand-muted',
                                    Icon ? 'pl-10' : 'pl-3',
                                    getSelectButtonColors(hasValue(value), disabled, error),
                                )}
                            >
                                {Icon && (
                                    <span
                                        className={tremorTwMerge(
                                            'absolute inset-y-0 left-0 flex items-center ml-px pl-2.5',
                                        )}
                                    >
                                        <Icon
                                            className={tremorTwMerge(
                                                makeSelectClassName('Icon'),
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
                                <span className='w-[90%] block truncate'>
                                    {value ? (valueToNameMapping.get(value) ?? placeholder) : placeholder}
                                </span>
                                <span className={tremorTwMerge('absolute inset-y-0 right-0 flex items-center mr-3')}>
                                    <ArrowDownHeadIcon
                                        className={tremorTwMerge(
                                            makeSelectClassName('arrowDownIcon'),
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
                                        'z-10 w-[var(--button-width)] divide-y overflow-y-auto outline-hidden rounded-tremor-default max-h-[228px]  border [--anchor-gap:4px]',
                                        // light
                                        'bg-tremor-background border-tremor-border divide-tremor-border shadow-tremor-dropdown',
                                        // dark
                                        'dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border dark:shadow-dark-tremor-dropdown',
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
                <p className={tremorTwMerge('errorMessage', 'text-sm text-rose-500 mt-1')}>{errorMessage}</p>
            ) : null}
        </div>
    );
});

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
                className={tremorTwMerge(
                    makeSelectItemClassName('root'),
                    // common
                    'flex justify-start items-center cursor-default text-tremor-default px-2.5 py-2.5',
                    // light
                    'data-focus:bg-tremor-background-muted  data-focus:text-tremor-content-strong data-selected:text-tremor-content-strong data-selected:bg-tremor-background-muted text-tremor-content-emphasis',
                    // dark
                    'dark:data-focus:bg-dark-tremor-background-muted  dark:data-focus:text-dark-tremor-content-strong dark:data-selected:text-dark-tremor-content-strong dark:data-selected:bg-dark-tremor-background-muted dark:text-dark-tremor-content-emphasis',
                    className,
                )}
                ref={ref}
                key={value}
                value={value}
            >
                {Icon && (
                    <Icon
                        className={tremorTwMerge(
                            makeSelectItemClassName('icon'),
                            // common
                            'flex-none w-5 h-5 mr-1.5',
                            // light
                            'text-tremor-content-subtle',
                            // dark
                            'dark:text-dark-tremor-content-subtle',
                        )}
                    />
                )}
                <span className='whitespace-nowrap truncate'>{children ?? value}</span>
            </ListboxOption>
        );
    },
);
