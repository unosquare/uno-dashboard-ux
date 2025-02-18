import type React from 'react';
import { useCallback } from 'react';
import { type PropsWithChildren, startTransition, useEffect, useMemo, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { twMerge } from 'tailwind-merge';
import { createCsv } from 'uno-js';
import { v4 as uuidv4 } from 'uuid';
import { ExportCsvButton } from '../ExportCsvButton';
import { Flex } from '../Flex';
import { NoData } from '../NoData';
import { SearchOrClearButton } from '../SearchBox';
import { TableCell, TableCellContent } from '../TableCell';
import { TextInput } from '../TextInput';
import type { ClassNameComponent, DataComponent, SortDirection, TableCellTypes, TableColumn } from '../constants';
import { useDebounce } from '../hooks';
import { getAlignment } from '../utils';
import { TableBase } from './TableBase';
import { TableBody } from './TableBody';
import { TableFoot } from './TableFoot';
import { TableFooterCell } from './TableFooterCell';
import { TableHeaders } from './TableHeaders';
import { TableRow } from './TableRow';
import { ShimmerTable } from './TableShimmer';
import { renderToRowString } from './exportCsv';
import { searchData, searchFooter, sortData } from './sortData';

export * from './sortData';
export * from './TableRow';
export * from './TableBody';
export * from './TableBase';
export * from './TableFoot';
export * from './TableFooterCell';
export * from './TableHead';
export * from './TableHeaderCell';

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

const getSortDirection = (current?: SortDirection): SortDirection => (current === 'desc' ? 'asc' : 'desc');

export const getColumnSorting = (prev: TableColumn[], index: number) =>
    prev.map((field, i) => ({
        ...field,
        sortOrder: i === index ? 1 : undefined,
        sortDirection: i === index ? getSortDirection(field.sortDirection) : undefined,
    }));

type TableFooterProps = {
    footer: unknown[];
    columns: TableColumn[];
};

const TableFooter = ({ footer, columns }: TableFooterProps) => (
    <TableFoot className='sticky top-0 bottom-0 bg-unodashboard-background dark:bg-dark-unodashboard-background'>
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

const SpanTable = ({ colSpan, children }: PropsWithChildren<{ colSpan: number }>) => (
    <TableRow>
        <TableCell colSpan={colSpan}>
            <Flex alignItems='center' className='w-full'>
                {children}
            </Flex>
        </TableCell>
    </TableRow>
);

const defaultTranform = <TDataIn,>(data: TDataIn) => {
    if (Array.isArray(data) && data[0] instanceof Object)
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

    const setSearchValue = useCallback(
        (x = '') => {
            setSearch(x);
            debouncedSearch();
        },
        [debouncedSearch],
    );

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

        // biome-ignore lint/complexity/noUselessFragments: You need it
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
        [search, setSearchValue],
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
            <TableBase className={twMerge('overflow-auto h-60 mt-5', className)}>
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
            </TableBase>
        </>
    );
};
