import React from 'react';
import { CheckboxChecked16Regular, CheckboxUnchecked16Regular } from '@fluentui/react-icons';
import { Flex, List, ListItem, TableCell as TremorTableCell } from '@tremor/react';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { v4 as uuidv4 } from 'uuid';
import { formatter, toMoney, toPercentage } from 'uno-js';
import { useToggle } from '../hooks';
import tw from 'tailwind-styled-components';
import { FinancialMetric, TableCellTypes, TableColumn } from '../constants';
import { twMerge } from 'tailwind-merge';
import { getAlignment, translateType } from '../utils';
import { BasicTooltip } from '../Tooltip';

const renderLinkString = (data: TableCellTypes) => {
    if (data instanceof Array) {
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
                    <ul className='gap-2'>
                        {data.map((x) => (
                            <li key={uuidv4()}>{x}</li>
                        ))}
                    </ul>
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
                <List>
                    <ListItem className='text-xs/[13px]'>
                        <span>Revenue:</span> <span>{toMoney(data.Revenue)}</span>
                    </ListItem>
                    <ListItem className='text-xs/[13px]'>
                        <span>Cost:</span> <span>{toMoney(data.Cost)}</span>
                    </ListItem>
                    <ListItem className='text-xs/[13px] font-medium'>
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
                        className={tremorTwMerge(
                            // common
                            'shrink-0 rounded-tremor-full border-2 h-3 w-3',
                            // light
                            'border-tremor-background shadow-tremor-card',
                            // dark
                            'dark:border-dark-tremor-background dark:shadow-dark-tremor-card',
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
        default:
            return formatter(String(data), translateType(column?.dataType), column?.formatterOptions);
    }
};

export const TableCell = ({
    column,
    index,
    children,
    className,
    ...other
}: { column: TableColumn; index: number } & React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <TremorTableCell
        className={twMerge('p-2 whitespace-normal text-xs/[13px]', getAlignment(column, index), className)}
        {...other}
    >
        {children}
    </TremorTableCell>
);
