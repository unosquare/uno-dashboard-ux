import React, { ReactNode, startTransition, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import tw from 'tailwind-styled-components';
import { createCsv, formatter, FormatTypes } from 'uno-js';
import {
    CaretDown12Regular,
    CaretUp12Regular,
    CheckboxChecked16Regular,
    CheckboxUnchecked16Regular,
    Search12Regular,
} from '@fluentui/react-icons';
import {
    Flex,
    TableBody,
    TableCell,
    TableFoot,
    TableFooterCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    TextInput,
    Table as TremorTable,
} from '@tremor/react';
import objectHash from 'object-hash';
import { twMerge } from 'tailwind-merge';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { sizing } from '@tremor/react/dist/lib/sizing';
import { border } from '@tremor/react/dist/lib/shape';
import { DataTypes, SortDirection } from '../constants';
import { NoData } from '../NoData';
import { searchData, searchFooter, sortData, TableColumn } from './sortData';
import { ExportCsvButton } from '../ExportCsvButton';
import { useDebounce } from '../hooks';

export * from './sortData';

export type RenderTableFunc = <TDataIn, TDataOut extends Array<unknown>>(
    data: TDataOut[],
    definitions: TableColumn[],
    rawData: TDataIn,
) => React.ReactNode;

export type TableSettings<TDataIn, TDataOut extends Array<any>> = {
    rawData: TDataIn;
    dataCallback: (data: TDataIn) => TDataOut[];
    columns: TableColumn[];
    isLoading?: boolean;
    noDataElement?: React.ReactNode;
    searchable?: boolean;
    calculateFooter?: (data: TDataIn) => unknown[];
    sortable?: boolean;
    exportCsv?: boolean;
    render?: RenderTableFunc;
    children?: React.ReactNode;
    className?: string;
};

type HeaderSettings = {
    $sortable: boolean;
    $sorted: boolean;
};

const getSortDirection = (current?: SortDirection): SortDirection => (current === 'desc' ? 'asc' : 'desc');

export const getColumnSorting = (prev: TableColumn[], index: number) =>
    prev.map((field, i) => ({
        ...field,
        sortOrder: i === index ? 1 : undefined,
        sortDirection: i === index ? getSortDirection(field.sortDirection) : undefined,
    }));

const leftAlign: Array<DataTypes | undefined> = ['string', 'link', 'bullet', undefined];
const rightAlign: Array<DataTypes | undefined> = ['decimal', 'number', 'money'];

export const getAlignment = (tableColumn: TableColumn, index?: number) => {
    if (tableColumn.textAlign) return `text-${tableColumn.textAlign.toLowerCase()}`;

    const { dataType } = tableColumn;
    if (dataType === 'paragraph' || (leftAlign.includes(dataType) && index === 0)) return 'text-left';

    return rightAlign.includes(dataType) ? 'text-right' : 'text-center';
};

export const HeaderDiv = tw.div<HeaderSettings>`
    flex-1
    flex-row
    inline-flex
    [&_svg]:h-4
    [&_svg]:w-4
    [&_svg]:ml-1
    [&_svg:hover]:opacity-100
    ${({ $sorted }) => ($sorted ? '[&_svg]:opacity-100' : '[&_svg]:opacity-30')}
    ${({ $sorted }) => ($sorted ? 'cursor-pointer' : '')}
`;

const StyledLinkButton = tw.button`
    bg-transparent
    border-0
    underline
    cursor-pointer
    text-[10px]
    position-[horizontal]
    p-2
`;

const translateType = (type: DataTypes | undefined): FormatTypes | undefined => {
    switch (type) {
        case 'date':
            return 'date';
        case 'money':
            return 'money';
        case 'percentage':
            return 'percentage';
        case 'days':
            return 'days';
        case 'months':
            return 'months';
        case 'decimal':
            return 'decimal';
        default:
            return undefined;
    }
};

const renderLinkString = (data: any) => {
    if (data instanceof Array) {
        return (data as string[])[0] ? (
            <>
                {(data as string[])[3] && <span>{`${(data as string[])[2].toString()} `}</span>}
                <a href={(data as string[])[0].toString()} target='_blank' rel='noopener noreferrer'>
                    {(data as string[])[1].toString()}
                </a>
                {!(data as string[])[3] && (data as string[])[2] && (
                    <span>{` ${(data as string[])[2].toString()}`}</span>
                )}
            </>
        ) : (
            (data as string[])[1].toString()
        );
    }

    return (
        <a href={data} target='_blank' rel='noopener noreferrer'>
            {data}
        </a>
    );
};

const LongTextCell = ({ text }: { text: string }) => {
    const [showFullText, setShowFullText] = useState(false);
    const toggleDisplayText = () => setShowFullText(!showFullText);

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

export const renderTableCell = (data: unknown, definition: TableColumn | undefined) => {
    if (!data && definition?.dataType === 'money') return '$0.00';
    if (data == null || data === ' ') return definition?.formatterOptions?.nullValue ?? 'N/A';

    switch (definition?.dataType) {
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
            const formatType = translateType(definition?.dataType);
            return formatType ? formatter(data.toString(), formatType, definition?.formatterOptions) : `${data}`;
        }
    }
};

type TableHeadersProps = {
    definitions: TableColumn[];
    sortable: boolean;
    setSortColumn: (index: number) => void;
};

const TableHeaders = ({ definitions, sortable, setSortColumn }: TableHeadersProps) => (
    <TableHead>
        <TableRow>
            {definitions.map((header, index) => (
                <TableHeaderCell
                    key={objectHash(header)}
                    className={`p-2 text-xs/[13px] bg-tremor-background dark:bg-dark-tremor-background whitespace-normal ${getAlignment(
                        header,
                        index,
                    )}`}
                    onClick={() => !header.excludeFromSort && setSortColumn(index)}
                >
                    <HeaderDiv $sortable={sortable} $sorted={Number(header.sortOrder) >= 1}>
                        {header.label}
                        {sortable &&
                            !header.excludeFromSort &&
                            (header.sortDirection === 'desc' && Number(header.sortOrder) >= 1 ? (
                                <CaretDown12Regular />
                            ) : (
                                <CaretUp12Regular />
                            ))}
                    </HeaderDiv>
                </TableHeaderCell>
            ))}
        </TableRow>
    </TableHead>
);

type TableFooterProps = {
    footer: unknown[];
    definition: TableColumn[];
};

const TableFooter = ({ footer, definition }: TableFooterProps) => (
    <TableFoot className='sticky top-0 bottom-0 bg-tremor-background dark:bg-dark-tremor-background'>
        <TableRow>
            {footer.map((foot, index) => (
                <TableFooterCell
                    key={objectHash(definition[index])}
                    className={`p-2 text-xs/[13px] ${getAlignment(definition[index], index)}`}
                >
                    {`${foot}`}
                </TableFooterCell>
            ))}
        </TableRow>
    </TableFoot>
);

const getRows: RenderTableFunc = (data: unknown[][], definitions: TableColumn[]) =>
    data.map((row: unknown[]) => (
        <TableRow key={objectHash(row)}>
            {row.map((cell: any, index: number) => (
                <TableCell
                    key={objectHash({ a: definitions[index], c: cell })}
                    className={`p-2 whitespace-normal text-xs/[13px] ${getAlignment(definitions[index], index)}`}
                >
                    {renderTableCell(cell, definitions[index])}
                </TableCell>
            ))}
        </TableRow>
    ));

const renderToRowString = (data: any[], definitions: TableColumn[]) =>
    data.map((row: any) =>
        row.map((cell: any, index: number) => {
            const dataType = definitions[index]?.dataType;
            if (dataType === 'boolean') return cell ? 'TRUE' : 'FALSE';
            if (!cell && dataType === 'money') return '$0.00';
            if (cell == null || cell === ' ') return 'N/A';

            const formatType = translateType(dataType);
            return formatType ? formatter(cell.toString(), formatType) : cell;
        }),
    );

const ShimmerTable = ({ colSpan }: { colSpan: number }) =>
    Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
            {Array.from({ length: colSpan }).map((o, k) => (
                <TableCell className='p-2' key={k}>
                    <div className='loading-shimmer rounded'>&nbsp;</div>
                </TableCell>
            ))}
        </TableRow>
    ));

const SpanTable = ({ colSpan, children }: { colSpan: number; children: ReactNode }) => (
    <TableRow>
        <TableCell colSpan={colSpan} className='p-2'>
            <Flex alignItems='center' className='w-full'>
                {children}
            </Flex>
        </TableCell>
    </TableRow>
);

export const Table = <TDataIn, TDataOut extends Array<unknown>>({
    columns,
    isLoading,
    noDataElement,
    searchable,
    calculateFooter,
    rawData,
    sortable = true,
    exportCsv = false,
    render,
    children,
    dataCallback,
    className = '',
}: TableSettings<TDataIn, TDataOut>) => {
    const [definitions, setDefinitions] = useState(columns);
    const [data, setData] = useState<TDataOut[]>([]);
    const [searched, setSearched] = useState<TDataOut[]>([]);
    const [footerData, setFooterData] = useState<unknown[]>();
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounce(() => {
        startTransition(() => {
            setSearched(searchData(search, data, definitions));
            if (calculateFooter) setFooterData(calculateFooter(searchFooter(search, rawData)));
        });
    });

    const onSearchInternal = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(target.value);
        debouncedSearch();
    };

    useEffect(() => {
        const raw = dataCallback(rawData);
        startTransition(() => {
            setData(raw);
            setSearched(raw);
            setSearch('');
            if (calculateFooter) setFooterData(calculateFooter(rawData));
        });
    }, [rawData, dataCallback, calculateFooter]);

    useEffect(() => setDefinitions(columns), [columns]);

    const setSortHeader = (index: number) => setDefinitions((prev: TableColumn[]) => getColumnSorting(prev, index));

    const onCsvClick = () => {
        const el = document.createElement('div');

        el.innerHTML = renderToString(<>{children}</>);
        const fileName = el.children.length > 0 ? el.children[0].textContent : undefined;

        el.remove();

        createCsv(
            renderToRowString(data, definitions),
            definitions.map((x) => x.label),
            fileName ?? 'file',
        );
    };

    const renderFunc = render ?? getRows;

    return (
        <>
            {(children || searchable || exportCsv) && (
                <Flex justifyContent='end' className='gap-4'>
                    {children}
                    {exportCsv && (
                        <ExportCsvButton
                            onClick={onCsvClick}
                            disabled={isLoading || searched.length === 0 ? true : undefined}
                        />
                    )}
                    {searchable && (
                        <TextInput
                            className='max-w-[220px]'
                            icon={Search12Regular}
                            value={search}
                            onChange={onSearchInternal}
                            disabled={isLoading}
                            type='text'
                            placeholder='Search'
                        />
                    )}
                </Flex>
            )}
            <TremorTable className={twMerge('overflow-auto h-60 mt-5', className)}>
                <TableHeaders
                    definitions={definitions}
                    sortable={!isLoading && sortable}
                    setSortColumn={setSortHeader}
                />
                <TableBody>
                    {isLoading && <ShimmerTable colSpan={definitions.length} />}
                    {!isLoading &&
                        (searched.length > 0 ? (
                            renderFunc(sortable ? sortData(searched, definitions) : searched, definitions, rawData)
                        ) : (
                            <SpanTable colSpan={definitions.length}>
                                <NoData>{noDataElement}</NoData>
                            </SpanTable>
                        ))}
                </TableBody>
                {searched.length > 0 && footerData && <TableFooter footer={footerData} definition={definitions} />}
            </TremorTable>
        </>
    );
};
