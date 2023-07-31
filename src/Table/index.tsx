import React, { ReactNode, startTransition, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import tw from 'tailwind-styled-components';
import { createCsv, formatter, FormatTypes } from 'uno-js';
import {
    CaretDown12Regular,
    CaretUp12Regular,
    CheckboxChecked16Regular,
    CheckboxUnchecked16Regular,
    DocumentArrowDown16Filled,
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
    Table as TremorTable,
} from '@tremor/react';
import objectHash from 'object-hash';
import { twMerge } from 'tailwind-merge';
import { DataTypes, SortDirection } from '../constants';
import { Ellipse } from '../Ellipse';
import { CardLoading } from '../CardLoading';
import { NoData } from '../NoData';
import { sortData, TableColumn } from './sortData';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';

export * from './sortData';

export interface TableSettings<TDataIn, TDataOut> {
    rawData: TDataIn;
    dataCallback: (data: TDataIn) => TDataOut[];
    columns: TableColumn[];
    isLoading?: boolean;
    noDataElement?: React.ReactNode;
    searchable?: boolean;
    calculateFooter?: (data: TDataIn) => (string | number)[];
    sortable?: boolean;
    exportCsv?: boolean;
    render?: <TIn>(data: (string | number)[], definitions: TableColumn[], rawData: TIn) => React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

interface HeaderSettings {
    $sortable: boolean;
    $sorted: boolean;
}

const getSortDirection = (current?: SortDirection) =>
    current === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;

export const getColumnSorting = (prev: TableColumn[], index: number) =>
    prev.map((field, i) => ({
        ...field,
        sortOrder: i === index ? 1 : undefined,
        sortDirection: i === index ? getSortDirection(field.sortDirection) : undefined,
    }));

const leftAlign = [DataTypes.STRING, DataTypes.LINK, DataTypes.BULLET, undefined];

export const getAlignment = (dataType: DataTypes | undefined, index?: number) => {
    if (dataType === DataTypes.PARAGRAPH || (leftAlign.includes(dataType) && index === 0)) return 'text-left';

    return dataType === DataTypes.PERCENTAGE ? 'text-right' : 'text-center';
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
    text-gray-800
    underline
    cursor-pointer
    text-[10px]
    position-[horizontal]
    p-2
`;

const translateType = (type: DataTypes | undefined) => {
    switch (type) {
        case DataTypes.DATE:
            return FormatTypes.DATE;
        case DataTypes.MONEY:
            return FormatTypes.MONEY;
        case DataTypes.PERCENTAGE:
            return FormatTypes.PERCENTAGE;
        case DataTypes.DAYS:
            return FormatTypes.DAYS;
        case DataTypes.MONTHS:
            return FormatTypes.MONTHS;
        case DataTypes.DECIMAL:
            return FormatTypes.DECIMAL;
        default:
            return undefined;
    }
};

const renderFileCell = (data: any) =>
    data[1] && (
        <div className='cursor-pointer'>
            <DocumentArrowDown16Filled primaryFill='#304FF3' onClick={data[0]} />
        </div>
    );

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

const LongTextCell = ({ text }: any) => {
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

export const renderTableCell = (
    data: Record<string, unknown> | string | number | boolean | string[] | any,
    type: DataTypes | undefined,
    formatterOptions?: {
        keepFormat?: boolean;
        decimals?: number;
        nullValue?: string;
    },
) => {
    if (!data && type === DataTypes.MONEY) return '$0.00';
    if (data == null || data === ' ') return 'N/A';

    switch (type) {
        case DataTypes.LINK:
            return renderLinkString(data);
        case DataTypes.BOOLEAN:
            return data ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />;
        case DataTypes.BULLET:
            return (
                <Flex alignItems='center'>
                    <Ellipse small color={(data as string[])[1].toString()} />
                    {(data as string[])[0].toString()}
                </Flex>
            );
        case DataTypes.PARAGRAPH:
            return (data as string[])[1] ? <LongTextCell text={data} /> : 'N/A';
        case DataTypes.FILE:
            return renderFileCell(data);
        default: {
            const formatType = translateType(type);
            return formatType ? formatter(data.toString(), formatType, formatterOptions) : data;
        }
    }
};

interface TableHeadersProps {
    definitions: TableColumn[];
    sortable: boolean;
    setSortColumn: (index: number) => void;
}

const TableHeaders = ({ definitions, sortable, setSortColumn }: TableHeadersProps) => (
    <TableHead>
        <TableRow>
            {definitions.map((header, index) => (
                <TableHeaderCell
                    key={objectHash(header)}
                    className={`p-2 text-xs/[13px] bg-white whitespace-normal ${getAlignment(
                        header.dataType || undefined,
                        index,
                    )}`}
                    onClick={() => !header.excludeFromSort && setSortColumn(index)}
                >
                    <HeaderDiv $sortable={sortable} $sorted={Number(header.sortOrder) >= 1}>
                        {header.label}
                        {sortable &&
                            !header.excludeFromSort &&
                            (header.sortDirection === SortDirection.DESC && Number(header.sortOrder) >= 1 ? (
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

interface TableFooterProps {
    footer: (string | number)[];
    definition: TableColumn[];
}

const TableFooter = ({ footer, definition }: TableFooterProps) => (
    <TableFoot className='sticky top-0 bottom-0 bg-white'>
        <TableRow>
            {footer.map((foot, index) => (
                <TableFooterCell
                    key={objectHash(definition[index])}
                    className={`p-2 text-xs/[13px] ${getAlignment(definition[index]?.dataType || undefined, index)}`}
                >
                    {foot}
                </TableFooterCell>
            ))}
        </TableRow>
    </TableFoot>
);

const getRows = (data: (string | number)[], definitions: TableColumn[]) =>
    data.map((row: any) => (
        <TableRow key={objectHash(row)}>
            {row.map((cell: any, index: number) => {
                const dataType = definitions[index]?.dataType || undefined;
                return (
                    <TableCell
                        key={objectHash({ a: definitions[index], c: cell })}
                        className={`p-2 whitespace-normal text-xs/[13px] ${getAlignment(dataType, index)}`}
                    >
                        {renderTableCell(cell, dataType, definitions[index]?.formatterOptions)}
                    </TableCell>
                );
            })}
        </TableRow>
    ));

const defaultFilter = (search: string) => (element: any) =>
    element && element.toString().toLowerCase().match(search.toLowerCase());

const searchData = (search: string, newData: any[], definitions: TableColumn[]) => {
    const ignoreColumns = definitions
        .filter((y) => y.disableSearch === true)
        .map((x) => definitions.findIndex((z) => z.label === x.label));

    return newData.filter((section: any[]) =>
        section.filter((_, i) => !ignoreColumns.includes(i)).some(defaultFilter(search)),
    );
};

const searchFooter = (search: string, newRaw: any) =>
    Array.isArray(newRaw)
        ? newRaw.filter((section: any) => Object.values(section).some(defaultFilter(search)))
        : newRaw;

const renderToRowString = (data: any[], definitions: TableColumn[]) =>
    data.map((row: any) =>
        row.map((cell: any, index: number) => {
            const dataType = definitions[index]?.dataType || undefined;
            if (dataType === DataTypes.BOOLEAN) return cell ? 'TRUE' : 'FALSE';
            if (!cell && dataType === DataTypes.MONEY) return '$0.00';
            if (cell == null || cell === ' ') return 'N/A';

            const formatType = translateType(dataType);
            return formatType ? formatter(cell.toString(), formatType) : cell;
        }),
    );

const SpanTable = ({ colSpan, children }: { colSpan: number; children: ReactNode }) => (
    <TableRow>
        <TableCell colSpan={colSpan} className='p-2'>
            <Flex alignItems='center' className='w-full'>
                {children}
            </Flex>
        </TableCell>
    </TableRow>
);

export const Table = <TDataIn, TDataOut>({
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
    const dataStore = (dataCallback && rawData && dataCallback(rawData)) || [];

    const [definitions, setDefinitions] = useState(columns);
    const [filteredData, setFilteredData] = useState(dataStore);
    const [filteredFooter, setFilteredFooter] = useState(
        (calculateFooter && rawData && calculateFooter(rawData)) || [],
    );
    const [lastSearch, setLastSearch] = useState('');
    const [searched, setSearched] = useState(dataStore);

    const onSearch = (search: string, newData?: TDataOut[], newRaw?: any) =>
        startTransition(() => {
            setLastSearch(search);
            const searchableRaw = newRaw || rawData;
            setSearched(searchData(search, newData || filteredData, definitions));

            if (calculateFooter && searchableRaw) {
                setFilteredFooter(calculateFooter(searchFooter(search, searchableRaw)));
            }
        });

    useEffect(() => {
        const subSet = (dataCallback && rawData && dataCallback(rawData)) || [];

        setFilteredData(subSet);
        setSearched(lastSearch ? searchData(lastSearch, subSet, definitions) : subSet);

        if (calculateFooter && rawData) {
            setFilteredFooter(calculateFooter(lastSearch ? searchFooter(lastSearch, rawData) : rawData));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calculateFooter, lastSearch, rawData, dataCallback]);

    useEffect(() => setDefinitions(columns), [columns]);

    const setSortHeader = (index: number) => setDefinitions((prev: TableColumn[]) => getColumnSorting(prev, index));

    const onCsvClick = () => {
        const el = document.createElement('div');

        el.innerHTML = renderToString(<>{children}</>);
        const fileName = el.children.length > 0 ? el.children[0].textContent : undefined;

        el.remove();

        createCsv(
            renderToRowString(filteredData, definitions),
            definitions.map((x) => x.label),
            fileName || 'file',
        );
    };

    const renderFunc = render || getRows;

    return (
        <>
            {(children || searchable || exportCsv) && (
                <Flex justifyContent='end' className='gap-4'>
                    {children}
                    {exportCsv && (
                        <ExportCsvButton onClick={onCsvClick} disable={dataStore.length <= 0 ? true : undefined} />
                    )}
                    {searchable && <SearchBox search={onSearch} disabled={isLoading} />}
                </Flex>
            )}
            <TremorTable className={twMerge('overflow-auto h-60 mt-5', className)}>
                <TableHeaders
                    definitions={definitions}
                    sortable={isLoading ? false : sortable}
                    setSortColumn={setSortHeader}
                />
                <TableBody>
                    {isLoading && (
                        <SpanTable colSpan={definitions.length}>
                            <CardLoading />
                        </SpanTable>
                    )}
                    {searched.length > 0 &&
                        !isLoading &&
                        renderFunc(sortable ? sortData(searched, definitions) : searched, definitions, rawData)}
                    {searched.length <= 0 && !isLoading && (
                        <SpanTable colSpan={definitions.length}>
                            <NoData>{noDataElement}</NoData>
                        </SpanTable>
                    )}
                </TableBody>
                {searched.length > 0 && !isLoading && filteredFooter && (
                    <TableFooter footer={filteredFooter} definition={definitions} />
                )}
            </TremorTable>
        </>
    );
};
