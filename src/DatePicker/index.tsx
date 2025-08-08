import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { format, isEqual, startOfMonth, startOfToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
import React, { useMemo } from 'react';
import type { DayPickerSingleProps } from 'react-day-picker';
import { Calendar } from '../Calendar';
import type { Color } from '../constants';
import { useInternalState } from '../hooks';
import { CalendarIcon, XCircleIcon } from '../reactUtils';
import { getSelectButtonColors, hasValue, makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const TODAY = startOfToday();

type Locale = typeof enUS;

export type DatePickerValue = Date | undefined;

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue'> {
    value?: Date;
    defaultValue?: Date;
    onValueChange?: (value: DatePickerValue) => void;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
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

const formatSelectedDates = (
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
        if (displayFormat) return `${format(startDate, displayFormat)} - ${format(endDate, displayFormat)}`;
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return `${startDate.toLocaleDateString(localeCode, options)} - 
                      ${endDate.toLocaleDateString(localeCode, options)}`;
    }
    return '';
};

const makeDatePickerClassName = makeClassName('DatePicker');

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
    const {
        value,
        defaultValue,
        onValueChange,
        minDate,
        maxDate,
        placeholder = 'Select date',
        disabled = false,
        locale = enUS,
        enableClear = true,
        displayFormat,
        className,
        enableYearNavigation = false,
        weekStartsOn = 0,
        disabledDates,
        ...other
    } = props;

    const [selectedValue, setSelectedValue] = useInternalState<Date | undefined>(defaultValue, value);

    const disabledDays = useMemo(() => {
        const disabledDays = [];
        if (minDate) disabledDays.push({ before: minDate });
        if (maxDate) disabledDays.push({ after: maxDate });
        return [...disabledDays, ...(disabledDates ?? [])];
    }, [minDate, maxDate, disabledDates]);

    const formattedSelection = !selectedValue
        ? placeholder
        : formatSelectedDates(selectedValue, undefined, locale, displayFormat);
    const defaultMonth = startOfMonth(selectedValue ?? maxDate ?? TODAY);

    const isClearEnabled = enableClear && !disabled;

    const handleReset = () => {
        onValueChange?.(undefined);
        setSelectedValue(undefined);
    };

    return (
        <Popover
            ref={ref}
            as='div'
            className={unoTwMerge(
                'relative w-full min-w-[10rem] text-unodashboard-default',
                'focus:ring-2 focus:ring-unodashboard-brand-muted dark:focus:ring-dark-unodashboard-brand-muted',
                className,
            )}
            {...other}
        >
            <PopoverButton
                disabled={disabled}
                className={unoTwMerge(
                    // common
                    'w-full outline-hidden text-left whitespace-nowrap truncate focus:ring-2 transition duration-100 rounded-unodashboard-default flex flex-nowrap border pl-3 py-2',
                    // light
                    'border-unodashboard-border shadow-unodashboard-input text-unodashboard-content-emphasis focus:border-unodashboard-brand-subtle focus:ring-unodashboard-brand-muted',
                    // dark
                    'dark:border-dark-unodashboard-border dark:shadow-dark-unodashboard-input dark:text-dark-unodashboard-content-emphasis dark:focus:border-dark-unodashboard-brand-subtle dark:focus:ring-dark-unodashboard-brand-muted',
                    isClearEnabled ? 'pr-8' : 'pr-4',
                    getSelectButtonColors(hasValue<Date>(selectedValue), disabled),
                )}
            >
                <CalendarIcon
                    className={unoTwMerge(
                        makeDatePickerClassName('calendarIcon'),
                        'flex-none shrink-0 h-5 w-5 mr-2 -ml-0.5',
                        // light
                        'text-unodashboard-content-subtle',
                        // light
                        'dark:text-dark-unodashboard-content-subtle',
                    )}
                    aria-hidden='true'
                />
                <p className='truncate'>{formattedSelection}</p>
            </PopoverButton>
            {isClearEnabled && selectedValue ? (
                <button
                    type='button'
                    className={unoTwMerge(
                        'absolute outline-hidden inset-y-0 right-0 flex items-center transition duration-100 mr-4',
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        handleReset();
                    }}
                >
                    <XCircleIcon
                        className={unoTwMerge(
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
                <PopoverPanel
                    anchor='bottom start'
                    className={unoTwMerge(
                        // common
                        'z-10 min-w-min divide-y overflow-y-auto outline-hidden rounded-unodashboard-default p-3 border [--anchor-gap:4px]',
                        // light
                        'bg-unodashboard-background border-unodashboard-border divide-unodashboard-border shadow-unodashboard-dropdown',
                        // dark
                        'dark:bg-dark-unodashboard-background dark:border-dark-unodashboard-border dark:divide-dark-unodashboard-border dark:shadow-dark-unodashboard-dropdown',
                    )}
                >
                    {({ close }) => (
                        <Calendar<DayPickerSingleProps>
                            showOutsideDays={true}
                            mode='single'
                            defaultMonth={defaultMonth}
                            selected={selectedValue}
                            weekStartsOn={weekStartsOn}
                            onSelect={
                                ((v: Date) => {
                                    onValueChange?.(v);
                                    setSelectedValue(v);
                                    close();
                                }) as any
                            }
                            locale={locale}
                            disabled={disabledDays}
                            enableYearNavigation={enableYearNavigation}
                        />
                    )}
                </PopoverPanel>
            </Transition>
        </Popover>
    );
});
