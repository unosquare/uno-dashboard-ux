import { CheckboxChecked16Regular, CheckboxUnchecked16Regular } from '@fluentui/react-icons';
import React from 'react';
import tw from 'tailwind-styled-components';
import { formatter, toMoney, toPercentage } from 'uno-js';
import { v4 as uuidv4 } from 'uuid';
import { Flex } from '../Flex';
import { List, ListItem } from '../List';
import { BasicTooltip } from '../Tooltip';
import type { FinancialMetric, TableCellTypes, TableColumn, Tenure } from '../constants';
import { useToggle } from '../hooks';
import { makeClassName } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import { getAlignment, translateType } from '../utils';

const renderLinkString = (data: TableCellTypes) => {
    if (Array.isArray(data)) {
        return data[0] ? (
            <a href={data[0]} target='_blank' rel='noopener noreferrer' className='underline'>
                {data[1]}
            </a>
        ) : (
            data[1]
        );
    }

    if (typeof data !== 'string') return null;

    return (
        <a href={data} target='_blank' rel='noopener noreferrer' className='underline'>
            {data}
        </a>
    );
};

const StyledLinkButton = tw.button`
    bg-transparent
    border-0
    underline
    cursor-pointer
    text-[10px]
    p-2
`;

const LongTextCell = ({ text }: { text: string }) => {
    const [showFullText, toggleDisplayText] = useToggle();

    if (text.length <= 100) return text;

    return (
        <>
            {showFullText ? text : `${text.substring(0, 100)}...`}
            <StyledLinkButton type='button' onClick={toggleDisplayText}>
                {showFullText ? 'Show Less' : 'Show More'}
            </StyledLinkButton>
        </>
    );
};

const defaultColumn: TableColumn = {
    label: '',
    dataType: 'string',
};

const ListCount = ({ data }: { data: string[] }) => {
    const id = uuidv4();
    return (
        <>
            {data.length > 1 && (
                <BasicTooltip id={`list-${id}`}>
                    <List className='gap-4'>
                        {data.map((x) => (
                            <ListItem className='text-xs/[13px]' key={uuidv4()}>
                                {x}
                            </ListItem>
                        ))}
                    </List>
                </BasicTooltip>
            )}
            <span data-tooltip-id={`list-${id}`} className='cursor-pointer'>
                {data.length}
            </span>
        </>
    );
};

const FinancialMetricCell = ({ data }: { data: FinancialMetric }) => {
    const id = uuidv4();
    return (
        <>
            <BasicTooltip id={`financial-${id}`}>
                <List className='gap-4'>
                    <ListItem className='text-xs/[13px] gap-2'>
                        <span>Revenue:</span> <span>{toMoney(data.Revenue)}</span>
                    </ListItem>
                    <ListItem className='text-xs/[13px] gap-2'>
                        <span>Cost:</span> <span>{toMoney(data.Cost)}</span>
                    </ListItem>
                    <ListItem className='text-xs/[13px]  gap-2 font-medium'>
                        <span>Gross Profit:</span> <span>{toMoney(data.GrossProfit)}</span>
                    </ListItem>
                </List>
            </BasicTooltip>
            <span data-tooltip-id={`financial-${id}`} className='cursor-pointer'>
                {toPercentage(data.GrossMargin)}
            </span>
        </>
    );
};

const TenureCell = ({ data, label }: { data: Tenure; label?: string }) => {
    const id = uuidv4();
    return (
        <>
            <BasicTooltip id={`tenure-${id}`}>
                <List className='gap-4'>
                    <ListItem className='text-xs/[13px] gap-2'>
                        <span>Start Date:</span> <span>{formatter(data.StartDate, 'date')}</span>
                    </ListItem>
                    {data.EndDate && (
                        <ListItem className='text-xs/[13px] gap-2'>
                            <span>End Date:</span> <span>{formatter(data.EndDate, 'date')}</span>
                        </ListItem>
                    )}
                </List>
            </BasicTooltip>
            <span data-tooltip-id={`tenure-${id}`} className='cursor-pointer'>
                {label ? String(data[label as keyof Tenure]) : formatter(data.Months, 'months')}
            </span>
        </>
    );
};

export const TableCellContent = ({ data, column }: { data: TableCellTypes; column: TableColumn | undefined }) => {
    const { dataType, formatterOptions } = column ?? defaultColumn;
    if (dataType !== 'money' && (data == null || data === ' ')) return formatterOptions?.nullValue ?? 'N/A';

    switch (dataType) {
        case 'link':
            return renderLinkString(data);
        case 'boolean':
            return data ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />;
        case 'bullet':
            return (
                <Flex alignItems='center'>
                    <span
                        className={unoTwMerge(
                            // common
                            'shrink-0 rounded-unodashboard-full border-2 h-3 w-3',
                            // light
                            'border-unodashboard-background shadow-unodashboard-card',
                            // dark
                            'dark:border-dark-unodashboard-background dark:shadow-dark-unodashboard-card',
                            (data as string[])[1],
                        )}
                    />
                    {(data as string[])[0]}
                </Flex>
            );
        case 'paragraph':
            return <LongTextCell text={String(data)} />;
        case 'money':
            return toMoney(data, { ...formatterOptions });
        case 'list':
            return <ListCount data={data as string[]} />;
        case 'financial':
            return <FinancialMetricCell data={data as FinancialMetric} />;
        case 'tenure':
            return <TenureCell data={data as Tenure} label={formatterOptions?.selector} />;
        default:
            return formatter(String(data), translateType(column?.dataType), column?.formatterOptions);
    }
};

const makeTableCellClassName = makeClassName('TableCell');

export const TableCell = React.forwardRef<
    HTMLTableCellElement,
    {
        column?: TableColumn;
        index?: number;
    } & React.TdHTMLAttributes<HTMLTableCellElement>
>(({ children, className, column, index, ...other }, ref) => (
    <td
        ref={ref}
        className={unoTwMerge(
            makeTableCellClassName('root'),
            'align-middle p-2 whitespace-normal text-xs/[13px]',
            getAlignment(column, index),
            className,
        )}
        {...other}
    >
        {children}
    </td>
));
