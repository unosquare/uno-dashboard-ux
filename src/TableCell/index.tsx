import { CheckboxChecked16Regular, CheckboxUnchecked16Regular } from '@fluentui/react-icons';
import { Flex, TableCell as TremorTableCell } from '@tremor/react';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { sizing } from '@tremor/react/dist/lib/sizing';
import { border } from '@tremor/react/dist/lib/shape';
import React from 'react';
import { formatter } from 'uno-js';
import { useToggle } from '../hooks';
import tw from 'tailwind-styled-components';
import { TableCellTypes, TableColumn } from '../constants';
import { twMerge } from 'tailwind-merge';
import { getAlignment, translateType } from '../utils';

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

export const TableCellContent = ({ data, column }: { data: TableCellTypes; column: TableColumn | undefined }) => {
    if (!data && column?.dataType === 'money') return '$0.00';
    if (data == null || data === ' ') return column?.formatterOptions?.nullValue ?? 'N/A';

    switch (column?.dataType) {
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
                            'shrink-0 rounded-tremor-full',
                            // light
                            'border-tremor-background shadow-tremor-card',
                            // dark
                            'dark:border-dark-tremor-background dark:shadow-dark-tremor-card',
                            (data as string[])[1],
                            sizing.sm.height,
                            sizing.sm.width,
                            border.md.all,
                        )}
                    />
                    {(data as string[])[0]}
                </Flex>
            );
        case 'paragraph':
            return <LongTextCell text={String(data)} />;
        default: {
            return formatter(String(data), translateType(column?.dataType), column?.formatterOptions);
        }
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
