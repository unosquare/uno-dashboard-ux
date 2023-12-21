import React, { PropsWithChildren, startTransition, useEffect, useMemo, useState } from 'react';
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
    TableFoot,
    TableFooterCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    TextInput,
    Table as TremorTable,
    TableCell as TremorTableCell,
} from '@tremor/react';
import objectHash from 'object-hash';
import { twMerge } from 'tailwind-merge';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { sizing } from '@tremor/react/dist/lib/sizing';
import { border } from '@tremor/react/dist/lib/shape';
import { ClassNameComponent, DataComponent, DataTypes, SortDirection } from '../constants';
import { NoData } from '../NoData';
import { searchData, searchFooter, sortData, TableCellTypes, TableColumn } from './sortData';
import { ExportCsvButton } from '../ExportCsvButton';
import { useDebounce, useToggle } from '../hooks';
import { ShimmerTable } from './TableShimmer';

export * from './sortData';

export type TableSettings<TDataIn> = DataComponent<TDataIn, TableCellTypes[][]> &
    ClassNameComponent & {
        columns: TableColumn[];
        noDataElement?: React.ReactNode;
        searchable?: boolean;
        calculateFooter?: (data: TDataIn) => string[];
        sortable?: boolean;
        exportCsv?: boolean;
        render?: (
            data: TableCellTypes[][],
            definitions: TableColumn[],
            rawData: TDataIn | undefined,
        ) => React.ReactNode;
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

export const renderTableCell = (data: TableCellTypes, definition: TableColumn | undefined) => {
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
            return formatter(String(data), translateType(definition?.dataType), definition?.formatterOptions);
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
                    key={header.label}
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
    columns: TableColumn[];
};

const TableFooter = ({ footer, columns }: TableFooterProps) => (
    <TableFoot className='sticky top-0 bottom-0 bg-tremor-background dark:bg-dark-tremor-background'>
        <TableRow>
            {columns.map((column, index) => (
                <TableFooterCell key={column.label} className={`p-2 text-xs/[13px] ${getAlignment(column, index)}`}>
                    {String(footer[index])}
                </TableFooterCell>
            ))}
        </TableRow>
    </TableFoot>
);

export const TableCell = ({
    column,
    index,
    children,
    className,
}: PropsWithChildren<{ column: TableColumn; index: number }> & ClassNameComponent) => (
    <TremorTableCell
        className={twMerge('p-2 whitespace-normal text-xs/[13px]', getAlignment(column, index), className)}
    >
        {children}
    </TremorTableCell>
);

const getRows = <TDataIn,>(data: TableCellTypes[][], columns: TableColumn[], rawData: TDataIn | undefined) =>
    data.map((row) => (
        <TableRow key={objectHash(row)}>
            {columns.map((column, index) =>
                column.render ? (
                    column.render(column, index, row[index], rawData)
                ) : (
                    <TableCell key={column.label} column={column} index={index}>
                        {renderTableCell(row[index], column)}
                    </TableCell>
                ),
            )}
        </TableRow>
    ));

const renderToRowString = (data: TableCellTypes[][], definitions: TableColumn[]) =>
    data.map((row) =>
        row.map((cell, index) => {
            const dataType = definitions[index]?.dataType;
            if (dataType === 'boolean') return cell ? 'TRUE' : 'FALSE';
            if (!cell && dataType === 'money') return '$0.00';

            const cellString = String(cell);
            if (cellString == null || cellString === ' ') return 'N/A';

            return formatter(cellString, translateType(dataType)) ?? cellString;
        }),
    );

const SpanTable = ({ colSpan, children }: PropsWithChildren<{ colSpan: number }>) => (
    <TableRow>
        <TremorTableCell colSpan={colSpan} className='p-2'>
            <Flex alignItems='center' className='w-full'>
                {children}
            </Flex>
        </TremorTableCell>
    </TableRow>
);

const defaultTranform = <TDataIn,>(data: TDataIn) => {
    if (data instanceof Array && data[0] instanceof Object)
        return data.map((x) => Object.values(x as Record<string, unknown>) as unknown as TableCellTypes[]);

    return data as unknown as TableCellTypes[][];
};

export const Table = <TDataIn,>({
    columns,
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
}: PropsWithChildren<TableSettings<TDataIn>>) => {
    const dataTransformFn = useMemo(() => dataCallback ?? defaultTranform, [dataCallback]);
    const [rawDataState, setRawDataState] = useState<TDataIn>();
    const [definitions, setDefinitions] = useState(columns);
    const [data, setData] = useState<TableCellTypes[][]>([]);
    const [searched, setSearched] = useState<TableCellTypes[][]>([]);
    const [footerData, setFooterData] = useState<unknown[]>();
    const [search, setSearch] = useState('');
    const [exporting, setExporting] = useState(false);

    const debouncedSearch = useDebounce(() => {
        startTransition(() => {
            setSearched(searchData(search, data, definitions));
            if (calculateFooter && rawDataState) setFooterData(calculateFooter(searchFooter(search, rawDataState)));
        });
    });

    const onSearchInternal = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(target.value);
        debouncedSearch();
    };

    useEffect(() => {
        if (!rawData) return;

        startTransition(() => {
            setRawDataState(rawData);

            const raw = dataTransformFn(rawData);
            setData(raw);
            setSearched(raw);
            setSearch('');
            if (calculateFooter) setFooterData(calculateFooter(rawData));
        });
    }, [rawData, dataTransformFn, calculateFooter]);

    useEffect(() => setDefinitions(columns), [columns]);

    const setSortHeader = (index: number) => setDefinitions((prev: TableColumn[]) => getColumnSorting(prev, index));

    const onCsvClick = () => {
        setExporting(true);
        const el = document.createElement('div');

        el.innerHTML = renderToString(<>{children}</>);
        const fileName = el.children.length > 0 ? el.children[0].textContent : undefined;

        el.remove();

        createCsv(
            renderToRowString(data, definitions),
            definitions.map((x) => x.label),
            fileName ?? 'file',
        );

        setExporting(false);
    };

    const renderFunc = render ?? getRows;
    const renderRows = () =>
        renderFunc(sortable ? sortData(searched, definitions) : searched, definitions, rawDataState);

    return (
        <>
            {(children || searchable || exportCsv) && (
                <Flex justifyContent='end' className='gap-4'>
                    {children}
                    {exportCsv && (
                        <ExportCsvButton
                            onClick={onCsvClick}
                            loading={exporting}
                            disabled={!rawData || searched.length === 0 ? true : undefined}
                        />
                    )}
                    {searchable && (
                        <TextInput
                            className='max-w-[220px]'
                            icon={Search12Regular}
                            value={search}
                            onChange={onSearchInternal}
                            disabled={!rawData}
                            type='text'
                            placeholder='Search'
                        />
                    )}
                </Flex>
            )}
            <TremorTable className={twMerge('overflow-auto h-60 mt-5', className)}>
                <TableHeaders
                    definitions={definitions}
                    sortable={rawData !== undefined && sortable}
                    setSortColumn={setSortHeader}
                />
                <TableBody>
                    {!rawData && <ShimmerTable colSpan={definitions.length} />}
                    {rawData &&
                        (searched.length > 0 ? (
                            renderRows()
                        ) : (
                            <SpanTable colSpan={definitions.length}>
                                <NoData>{noDataElement}</NoData>
                            </SpanTable>
                        ))}
                </TableBody>
                {searched.length > 0 && footerData && <TableFooter footer={footerData} columns={definitions} />}
            </TremorTable>
        </>
    );
};
