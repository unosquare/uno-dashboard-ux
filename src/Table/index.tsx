import React, { ReactNode, startTransition, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import tw from 'tailwind-styled-components';
import { createCsv, formatter } from 'uno-js';
import {
    CaretDown12Regular,
    CaretUp12Regular,
    CheckboxChecked16Regular,
    CheckboxUnchecked16Regular,
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
import { searchData, sortData, TableColumn } from './sortData';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';

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
    calculateFooter?: (data: TDataOut[], rawData: TDataIn) => (string | number)[];
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

export const getAlignment = (dataType: DataTypes | undefined, index?: number) => {
    if (dataType === 'paragraph' || (leftAlign.includes(dataType) && index === 0)) return 'text-left';

    return dataType === 'percentage' ? 'text-right' : 'text-center';
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

export const renderTableCell = (
    data: unknown,
    type: DataTypes | undefined,
    formatterOptions?: {
        keepFormat?: boolean;
        decimals?: number;
        nullValue?: string;
    },
) => {
    if (!data && type === 'money') return '$0.00';
    if (data == null || data === ' ') return formatterOptions?.nullValue ?? 'N/A';

    switch (type) {
        case 'link':
            return renderLinkString(data);
        case 'boolean':
            return data ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />;
        case 'bullet':
            return (
                <Flex alignItems='center'>
                    <Ellipse small color={(data as string[])[1].toString()} />
                    {(data as string[])[0].toString()}
                </Flex>
            );
        case 'paragraph':
            return <LongTextCell text={String(data)} />;
        default: {
            const formatType = translateType(type);
            return formatType ? formatter(data.toString(), formatType, formatterOptions) : `${data}`;
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
    footer: (string | number)[];
    definition: TableColumn[];
};

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

const getRows: RenderTableFunc = <_, TDataOut extends Array<unknown>>(data: TDataOut[], definitions: TableColumn[]) =>
    data.map((row: TDataOut) => (
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

const renderToRowString = (data: any[], definitions: TableColumn[]) =>
    data.map((row: any) =>
        row.map((cell: any, index: number) => {
            const dataType = definitions[index]?.dataType || undefined;
            if (dataType === 'boolean') return cell ? 'TRUE' : 'FALSE';
            if (!cell && dataType === 'money') return '$0.00';
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
    const [filteredData, setFilteredData] = useState<TDataOut[]>([]);
    const [lastSearch, setLastSearch] = useState('');
    const [searched, setSearched] = useState<TDataOut[]>([]);

    const onSearch = (search: string) =>
        startTransition(() => {
            setLastSearch(search);
            setSearched(searchData(search, filteredData, definitions));
        });

    useEffect(() => {
        const subSet = dataCallback(rawData);

        setFilteredData(subSet);
        setSearched(lastSearch ? searchData(lastSearch, subSet, definitions) : subSet);
    }, [rawData, dataCallback]);

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
                        <ExportCsvButton
                            onClick={onCsvClick}
                            disabled={isLoading || searched.length === 0 ? true : undefined}
                        />
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
                {searched.length > 0 && !isLoading && calculateFooter && (
                    <TableFooter footer={calculateFooter(searched, rawData)} definition={definitions} />
                )}
            </TremorTable>
        </>
    );
};
