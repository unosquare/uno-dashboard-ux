import { addYears, format } from 'date-fns';
import { DayPicker, type DayPickerRangeProps, type DayPickerSingleProps, useNavigation } from 'react-day-picker';
import { Icon as IconComponent } from '../Icon';
import { Text } from '../TextElements';
import { tremorTwMerge } from '../tremorTwMerge';

interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    onClick: () => void;
    icon: React.ElementType;
}

const ArrowLeftHeadIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Left</title>
        <path d='M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z' />
    </svg>
);

const ArrowRightHeadIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Right</title>
        <path d='M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z' />
    </svg>
);

const DoubleArrowLeftHeadIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Double Left</title>
        <path d='M4.83582 12L11.0429 18.2071L12.4571 16.7929L7.66424 12L12.4571 7.20712L11.0429 5.79291L4.83582 12ZM10.4857 12L16.6928 18.2071L18.107 16.7929L13.3141 12L18.107 7.20712L16.6928 5.79291L10.4857 12Z' />
    </svg>
);

const DoubleArrowRightHeadIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Double Right</title>
        <path d='M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z' />
    </svg>
);

const NavButton = ({ onClick, icon, ...other }: NavButtonProps) => {
    const Icon = icon;
    return (
        <button
            type='button'
            className={tremorTwMerge(
                'flex items-center justify-center p-1 h-7 w-7 outline-hidden focus:ring-2 transition duration-100 border border-tremor-border dark:border-dark-tremor-border hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted rounded-tremor-small focus:border-tremor-brand-subtle select-none dark:focus:border-dark-tremor-brand-subtle focus:ring-tremor-brand-muted dark:focus:ring-dark-tremor-brand-muted text-tremor-content-subtle dark:text-dark-tremor-content-subtle hover:text-tremor-content dark:hover:text-dark-tremor-content',
            )}
            {...other}
        >
            <IconComponent onClick={onClick} icon={Icon} variant='simple' color='slate' size='sm' />
        </button>
    );
};

export const Calendar = <T extends DayPickerSingleProps | DayPickerRangeProps>({
    mode,
    defaultMonth,
    selected,
    onSelect,
    locale,
    disabled,
    enableYearNavigation,
    classNames,
    weekStartsOn = 0,
    ...other
}: T & { enableYearNavigation: boolean }) => (
    <DayPicker
        showOutsideDays={true}
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        mode={mode as any}
        defaultMonth={defaultMonth}
        selected={selected}
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onSelect={onSelect as any}
        locale={locale}
        disabled={disabled}
        weekStartsOn={weekStartsOn}
        classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-2 relative items-center',
            caption_label:
                'text-tremor-default text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button:
                'flex items-center justify-center p-1 h-7 w-7 outline-hidden focus:ring-2 transition duration-100 border border-tremor-border dark:border-dark-tremor-border hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted rounded-tremor-small focus:border-tremor-brand-subtle dark:focus:border-dark-tremor-brand-subtle focus:ring-tremor-brand-muted dark:focus:ring-dark-tremor-brand-muted text-tremor-content-subtle dark:text-dark-tremor-content-subtle hover:text-tremor-content dark:hover:text-dark-tremor-content',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'w-9 font-normal text-center text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
            row: 'flex w-full mt-0.5',
            cell: 'text-center p-0 relative focus-within:relative text-tremor-default text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis',
            day: 'h-9 w-9 p-0 hover:bg-tremor-background-subtle dark:hover:bg-dark-tremor-background-subtle outline-tremor-brand dark:outline-dark-tremor-brand rounded-tremor-default',
            day_today: 'font-bold',
            day_selected:
                'aria-selected:bg-tremor-background-emphasis aria-selected:text-tremor-content-inverted dark:aria-selected:bg-dark-tremor-background-emphasis dark:aria-selected:text-dark-tremor-content-inverted ',
            day_disabled:
                'text-tremor-content-subtle dark:text-dark-tremor-content-subtle disabled:hover:bg-transparent',
            day_outside: 'text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
            ...classNames,
        }}
        components={{
            IconLeft: ({ ...props }) => <ArrowLeftHeadIcon className='h-4 w-4' {...props} />,
            IconRight: ({ ...props }) => <ArrowRightHeadIcon className='h-4 w-4' {...props} />,
            Caption: ({ ...props }) => {
                const { goToMonth, nextMonth, previousMonth, currentMonth } = useNavigation();

                return (
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center space-x-1'>
                            {enableYearNavigation && (
                                <NavButton
                                    onClick={() => currentMonth && goToMonth(addYears(currentMonth, -1))}
                                    icon={DoubleArrowLeftHeadIcon}
                                />
                            )}
                            <NavButton
                                onClick={() => previousMonth && goToMonth(previousMonth)}
                                icon={ArrowLeftHeadIcon}
                            />
                        </div>

                        <Text className='text-tremor-default tabular-nums capitalize text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis font-medium'>
                            {format(props.displayMonth, 'LLLL yyy', { locale })}
                        </Text>

                        <div className='flex items-center space-x-1'>
                            <NavButton onClick={() => nextMonth && goToMonth(nextMonth)} icon={ArrowRightHeadIcon} />
                            {enableYearNavigation && (
                                <NavButton
                                    onClick={() => currentMonth && goToMonth(addYears(currentMonth, 1))}
                                    icon={DoubleArrowRightHeadIcon}
                                />
                            )}
                        </div>
                    </div>
                );
            },
        }}
        {...other}
    />
);
