import { format, isEqual, max, min, startOfDay, startOfMonth, startOfToday, startOfYear, sub } from 'date-fns';
import React, { type ReactElement, useMemo, useState } from 'react';
import type { DateRange, DayPickerRangeProps } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import {
    Popover,
    PopoverButton,
    Transition,
    PopoverPanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
} from '@headlessui/react';
import { Calendar } from '../Calendar';
import type { Color } from '../constants';
import { useInternalState } from '../hooks';
import { getNodeText, constructValueToNameMapping, XCircleIcon, CalendarIcon } from '../reactUtils';
import { SelectItem } from '../Select';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { tremorTwMerge } from '../tremorTwMerge';

export interface DateRangePickerItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    from: Date;
    to?: Date;
}

export const DateRangePickerItem = React.forwardRef<HTMLDivElement, DateRangePickerItemProps>(
    ({ value, className, children, ...other }, ref) => (
        <SelectItem ref={ref} className={className} value={value} {...other}>
            {children ?? value}
        </SelectItem>
    ),
);

export type DateRangePickerOption = {
    value: string;
    text: string;
    from: Date;
    to?: Date;
};
export type DropdownValues = Map<string, Omit<DateRangePickerOption, 'value'>>;

export const makeDateRangePickerClassName = makeClassName('DateRangePicker');

export const parseStartDate = (
    startDate: Date | undefined,
    minDate: Date | undefined,
    selectedDropdownValue: string | undefined,
    selectValues: DropdownValues,
) => {
    let newStartDate = startDate;
    if (selectedDropdownValue) {
        newStartDate = selectValues.get(selectedDropdownValue)?.from;
    }
    if (!newStartDate) return undefined;
    if (newStartDate && !minDate) return startOfDay(newStartDate);
    return startOfDay(max([newStartDate as Date, minDate as Date]));
};

export const parseEndDate = (
    endDate: Date | undefined,
    maxDate: Date | undefined,
    selectedDropdownValue: string | undefined,
    selectValues: DropdownValues,
) => {
    let newEndDate = endDate;
    if (selectedDropdownValue) {
        newEndDate = startOfDay(selectValues.get(selectedDropdownValue)?.to ?? startOfToday());
    }
    if (!newEndDate) return undefined;
    if (newEndDate && !maxDate) return startOfDay(newEndDate);

    return startOfDay(min([endDate as Date, maxDate as Date]));
};

export const defaultOptions: DateRangePickerOption[] = [
    {
        value: 'tdy',
        text: 'Today',
        from: startOfToday(),
    },
    {
        value: 'w',
        text: 'Last 7 days',
        from: sub(startOfToday(), { days: 7 }),
    },
    {
        value: 't',
        text: 'Last 30 days',
        from: sub(startOfToday(), { days: 30 }),
    },
    {
        value: 'm',
        text: 'Month to Date',
        from: startOfMonth(startOfToday()),
    },
    {
        value: 'y',
        text: 'Year to Date',
        from: startOfYear(startOfToday()),
    },
];

export const formatSelectedDates = (
    startDate: Date | undefined,
    endDate: Date | undefined,
    locale?: Locale,
    displayFormat?: string,
) => {
    const localeCode = locale?.code ?? 'en-US';
    if (!startDate && !endDate) {
        return '';
    }

    if (startDate && !endDate) {
        if (displayFormat) return format(startDate, displayFormat);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return startDate.toLocaleDateString(localeCode, options);
    }
    if (startDate && endDate) {
        if (isEqual(startDate, endDate)) {
            if (displayFormat) return format(startDate, displayFormat);
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            };
            return startDate.toLocaleDateString(localeCode, options);
        }

        if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
            if (displayFormat) return `${format(startDate, displayFormat)} - ${format(endDate, displayFormat)}`;

            const optionsStartDate: Intl.DateTimeFormatOptions = {
                month: 'short',
                day: 'numeric',
            };
            return `${startDate.toLocaleDateString(localeCode, optionsStartDate)} - 
                      ${endDate.getDate()}, ${endDate.getFullYear()}`;
        }

        {
            if (displayFormat) return `${format(startDate, displayFormat)} - ${format(endDate, displayFormat)}`;
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            };
            return `${startDate.toLocaleDateString(localeCode, options)} - 
                      ${endDate.toLocaleDateString(localeCode, options)}`;
        }
    }
    return '';
};
const TODAY = startOfToday();

export type Locale = typeof enUS;

export type DateRangePickerValue = { from?: Date; to?: Date; selectValue?: string };

export interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue'> {
    value?: DateRangePickerValue;
    defaultValue?: DateRangePickerValue;
    onValueChange?: (value: DateRangePickerValue) => void;
    enableSelect?: boolean;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    selectPlaceholder?: string;
    disabled?: boolean;
    color?: Color;
    locale?: Locale;
    enableClear?: boolean;
    displayFormat?: string;
    enableYearNavigation?: boolean;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    disabledDates?: Date[];
    children?: React.ReactElement[] | React.ReactElement;
}

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>((props, ref) => {
    const {
        value,
        defaultValue,
        onValueChange,
        enableSelect = true,
        minDate,
        maxDate,
        placeholder = 'Select range',
        selectPlaceholder = 'Select range',
        disabled = false,
        locale = enUS,
        enableClear = true,
        displayFormat,
        children,
        className,
        enableYearNavigation = false,
        weekStartsOn = 0,
        disabledDates,
        ...other
    } = props;

    const [selectedValue, setSelectedValue] = useInternalState(defaultValue, value);
    const [isCalendarButtonFocused, setIsCalendarButtonFocused] = useState(false);
    const [isSelectButtonFocused, setIsSelectButtonFocused] = useState(false);

    const disabledDays = useMemo(() => {
        const x = [];
        if (minDate) x.push({ before: minDate });
        if (maxDate) x.push({ after: maxDate });
        return [...x, ...(disabledDates ?? [])];
    }, [minDate, maxDate, disabledDates]);

    const selectValues = useMemo(() => {
        const x = new Map<string, Omit<DateRangePickerItemProps, 'value'> & { text: string }>();

        if (children) {
            React.Children.forEach(
                children as ReactElement[],
                (child: React.ReactElement<DateRangePickerItemProps>) => {
                    x.set(child.props.value, {
                        text: (getNodeText(child) ?? child.props.value) as string,
                        from: child.props.from,
                        to: child.props.to,
                    });
                },
            );
        } else {
            // biome-ignore lint/complexity/noForEach: <explanation>
            defaultOptions.forEach((option) => {
                x.set(option.value, {
                    text: option.text,
                    from: option.from,
                    to: TODAY,
                });
            });
        }
        return x;
    }, [children]);

    const valueToNameMapping = useMemo(() => {
        if (children) {
            return constructValueToNameMapping(children);
        }
        const valueToNameMapping = new Map<string, string>();
        // biome-ignore lint/complexity/noForEach: <explanation>
        defaultOptions.forEach((option) => valueToNameMapping.set(option.value, option.text));
        return valueToNameMapping;
    }, [children]);

    const selectedSelectValue = selectedValue?.selectValue || '';
    const selectedStartDate = parseStartDate(selectedValue?.from, minDate, selectedSelectValue, selectValues);
    const selectedEndDate = parseEndDate(selectedValue?.to, maxDate, selectedSelectValue, selectValues);
    const formattedSelection =
        !selectedStartDate && !selectedEndDate
            ? placeholder
            : formatSelectedDates(selectedStartDate, selectedEndDate, locale, displayFormat);
    const defaultMonth = startOfMonth(selectedEndDate ?? selectedStartDate ?? maxDate ?? TODAY);

    const isClearEnabled = enableClear && !disabled;

    const handleSelectClick = (value: string) => {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const { from, to } = selectValues.get(value)!;
        const toDate = to ?? TODAY;
        onValueChange?.({ from, to: toDate, selectValue: value });
        setSelectedValue({ from, to: toDate, selectValue: value });
    };

    const handleReset = () => {
        onValueChange?.({});
        setSelectedValue({});
    };

    return (
        <div
            ref={ref}
            className={tremorTwMerge(
                'w-full min-w-[10rem] relative flex justify-between text-tremor-default max-w-sm shadow-tremor-input dark:shadow-dark-tremor-input rounded-tremor-default',
                className,
            )}
            {...other}
        >
            <Popover
                as='div'
                className={tremorTwMerge(
                    'w-full',
                    enableSelect ? 'rounded-l-tremor-default' : 'rounded-tremor-default',
                    isCalendarButtonFocused && 'ring-2 ring-tremor-brand-muted dark:ring-dark-tremor-brand-muted z-10',
                )}
            >
                <div className='relative w-full'>
                    <PopoverButton
                        onFocus={() => setIsCalendarButtonFocused(true)}
                        onBlur={() => setIsCalendarButtonFocused(false)}
                        disabled={disabled}
                        className={tremorTwMerge(
                            // common
                            'w-full outline-none text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-l-tremor-default flex flex-nowrap border pl-3 py-2',
                            // light
                            'rounded-l-tremor-default border-tremor-border text-tremor-content-emphasis focus:border-tremor-brand-subtle focus:ring-tremor-brand-muted',
                            // dark
                            'dark:border-dark-tremor-border dark:text-dark-tremor-content-emphasis dark:focus:border-dark-tremor-brand-subtle dark:focus:ring-dark-tremor-brand-muted',
                            enableSelect ? 'rounded-l-tremor-default' : 'rounded-tremor-default',
                            isClearEnabled ? 'pr-8' : 'pr-4',
                            getSelectButtonColors(hasValue<Date>(selectedStartDate || selectedEndDate), disabled),
                        )}
                    >
                        <CalendarIcon
                            className={tremorTwMerge(
                                makeDateRangePickerClassName('calendarIcon'),
                                'flex-none shrink-0 h-5 w-5 -ml-0.5 mr-2',
                                // light
                                'text-tremor-content-subtle',
                                // light
                                'dark:text-dark-tremor-content-subtle',
                            )}
                            aria-hidden='true'
                        />
                        <p className='truncate'>{formattedSelection}</p>
                    </PopoverButton>
                    {isClearEnabled && selectedStartDate ? (
                        <button
                            type='button'
                            className={tremorTwMerge(
                                'absolute outline-none inset-y-0 right-0 flex items-center transition duration-100 mr-4',
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                handleReset();
                            }}
                        >
                            <XCircleIcon
                                className={tremorTwMerge(
                                    makeDateRangePickerClassName('clearIcon'),
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
                </div>
                <Transition
                    enter='transition ease duration-100 transform'
                    enterFrom='opacity-0 -translate-y-4'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease duration-100 transform'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 -translate-y-4'
                >
                    <PopoverPanel
                        anchor='bottom start'
                        focus={true}
                        className={tremorTwMerge(
                            // common
                            'min-w-min divide-y overflow-y-auto outline-none rounded-tremor-default p-3 border [--anchor-gap:4px]',
                            // light
                            'bg-tremor-background border-tremor-border divide-tremor-border shadow-tremor-dropdown',
                            // dark
                            'dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border dark:shadow-dark-tremor-dropdown',
                        )}
                    >
                        <Calendar<DayPickerRangeProps>
                            mode='range'
                            showOutsideDays={true}
                            defaultMonth={defaultMonth}
                            selected={{
                                from: selectedStartDate,
                                to: selectedEndDate,
                            }}
                            onSelect={
                                ((v: DateRange) => {
                                    onValueChange?.({ from: v?.from, to: v?.to });
                                    setSelectedValue({ from: v?.from, to: v?.to });
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                }) as any
                            }
                            locale={locale}
                            disabled={disabledDays}
                            enableYearNavigation={enableYearNavigation}
                            classNames={{
                                day_range_middle: tremorTwMerge(
                                    '!rounded-none aria-selected:!bg-tremor-background-subtle aria-selected:dark:!bg-dark-tremor-background-subtle aria-selected:!text-tremor-content aria-selected:dark:!bg-dark-tremor-background-subtle',
                                ),
                                day_range_start:
                                    'rounded-r-none rounded-l-tremor-small aria-selected:text-tremor-brand-inverted dark:aria-selected:text-dark-tremor-brand-inverted',
                                day_range_end:
                                    'rounded-l-none rounded-r-tremor-small aria-selected:text-tremor-brand-inverted dark:aria-selected:text-dark-tremor-brand-inverted',
                            }}
                            weekStartsOn={weekStartsOn}
                            {...props}
                        />
                    </PopoverPanel>
                </Transition>
            </Popover>
            {enableSelect && (
                <Listbox
                    as='div'
                    className={tremorTwMerge(
                        'w-48 -ml-px rounded-r-tremor-default',
                        isSelectButtonFocused &&
                            'ring-2 ring-tremor-brand-muted dark:ring-dark-tremor-brand-muted z-10',
                    )}
                    value={selectedSelectValue}
                    onChange={handleSelectClick}
                    disabled={disabled}
                >
                    {(x) => (
                        <>
                            <ListboxButton
                                onFocus={() => setIsSelectButtonFocused(true)}
                                onBlur={() => setIsSelectButtonFocused(false)}
                                className={tremorTwMerge(
                                    // common
                                    'w-full outline-none text-left whitespace-nowrap truncate rounded-r-tremor-default transition duration-100 border px-4 py-2',
                                    // light
                                    'border-tremor-border text-tremor-content-emphasis focus:border-tremor-brand-subtle',
                                    // dark
                                    'dark:border-dark-tremor-border  dark:text-dark-tremor-content-emphasis dark:focus:border-dark-tremor-brand-subtle',
                                    getSelectButtonColors(hasValue<string>(x.value), disabled),
                                )}
                            >
                                {x.value ? (valueToNameMapping.get(x.value) ?? selectPlaceholder) : selectPlaceholder}
                            </ListboxButton>
                            <Transition
                                enter='transition ease duration-100 transform'
                                enterFrom='opacity-0 -translate-y-4'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease duration-100 transform'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 -translate-y-4'
                            >
                                <ListboxOptions
                                    anchor='bottom end'
                                    className={tremorTwMerge(
                                        // common
                                        '[--anchor-gap:4px] divide-y overflow-y-auto outline-none border min-w-44',
                                        // light
                                        'shadow-tremor-dropdown bg-tremor-background border-tremor-border divide-tremor-border rounded-tremor-default',
                                        // dark
                                        'dark:shadow-dark-tremor-dropdown dark:bg-dark-tremor-background dark:border-dark-tremor-border dark:divide-dark-tremor-border',
                                    )}
                                >
                                    {children ??
                                        defaultOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.text}
                                            </SelectItem>
                                        ))}
                                </ListboxOptions>
                            </Transition>
                        </>
                    )}
                </Listbox>
            )}
        </div>
    );
});
