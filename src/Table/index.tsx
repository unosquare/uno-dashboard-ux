import React, { PropsWithChildren, startTransition, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { renderToString } from 'react-dom/server';
import tw from 'tailwind-styled-components';
import { createCsv, formatter, isMoneyObject, toMoney } from 'uno-js';
import { CaretDown12Regular, CaretUp12Regular } from '@fluentui/react-icons';
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
import { twMerge } from 'tailwind-merge';
import { ClassNameComponent, DataComponent, DataTypes, SortDirection, TableCellTypes, TableColumn } from '../constants';
import { NoData } from '../NoData';
import { searchData, searchFooter, sortData } from './sortData';
import { ExportCsvButton } from '../ExportCsvButton';
import { useDebounce } from '../hooks';
import { ShimmerTable } from './TableShimmer';
import { getAlignment, translateType } from '../utils';
import { TableCell, TableCellContent } from '../TableCell';
import { SearchOrClearButton } from '../SearchBox';

export * from './sortData';

export type TableSettings<TDataIn> = DataComponent<TDataIn, TableCellTypes[][]> &
    ClassNameComponent & {
        columns: TableColumn[];
        noDataElement?: React.ReactNode;
        searchable?: boolean;
        calculateFooter?: (data: TDataIn) => string[];
        sortable?: boolean;
        exportCsv?: boolean;
        render?: (data: TableCellTypes[][], definitions: TableColumn[], rawData: TDataIn) => React.ReactNode;
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

type TableHeadersProps = {
    definitions: TableColumn[];
    sortable: boolean;
    setSortColumn: (index: number) => void;
};

const SortHeaderIcon = ({ direction, order }: { direction?: SortDirection; order?: number }) =>
    direction === 'desc' && Number(order) >= 1 ? <CaretDown12Regular /> : <CaretUp12Regular />;

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
                        {sortable && !header.excludeFromSort && (
                            <SortHeaderIcon direction={header.sortDirection} order={header.sortOrder} />
                        )}
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

const getRows = <TDataIn,>(data: TableCellTypes[][], columns: TableColumn[], rawData: TDataIn) =>
    data.map((row, rowIndex) => (
        <TableRow key={uuidv4()}>
            {columns.map((column, columnIndex) =>
                column.render ? (
                    column.render(column, { rowIndex, columnIndex }, row[columnIndex], rawData, data)
                ) : (
                    <TableCell key={column.label} column={column} index={columnIndex}>
                        <TableCellContent data={row[columnIndex]} column={column} />
                    </TableCell>
                ),
            )}
        </TableRow>
    ));

const renderCellString = (cell: TableCellTypes, dataType?: DataTypes) => {
    const cellString = String(cell);
    if (cellString == null || cellString === ' ') return 'N/A';

    return formatter(cellString, translateType(dataType)) ?? cellString;
};

const renderToRowString = (data: TableCellTypes[][], definitions: TableColumn[]) =>
    data.map((row) =>
        row.map((cell, index) => {
            const { dataType, formatterOptions } = definitions[index];
            if (dataType === 'money' && !cell) return toMoney(0, { ...formatterOptions }) as string;
            if (isMoneyObject(cell)) return toMoney(cell, { ...formatterOptions }) as string;
            if (dataType === 'boolean') return cell ? 'TRUE' : 'FALSE';
            if (dataType === 'link' && cell instanceof Array && cell.length > 1) return String(cell[1]);

            return renderCellString(cell, dataType);
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

    const setSearchValue = (x = '') => {
        setSearch(x);
        debouncedSearch();
    };

    const onSearchInternal = ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearchValue(target.value);

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
    const renderRows = () => {
        if (rawDataState)
            return renderFunc(sortable ? sortData(searched, definitions) : searched, definitions, rawDataState);

        return [];
    };

    const icon = useMemo(
        () => () => <SearchOrClearButton hasValue={search.length > 0} onClick={setSearchValue} />,
        [search],
    );

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
                            className='max-w-[220px] [&_input]:px-[10px] [&_svg]:ml-2'
                            icon={icon}
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
