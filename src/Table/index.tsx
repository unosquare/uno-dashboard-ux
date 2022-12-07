import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { startTransition, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createCsv, formatter, FormatTypes } from 'uno-js';
import { CardContent } from '../Card';
import { Colors, CurrencyRate, DataTypes, Directions, FlexValues, SizeValues, SortDirection } from '../constants';
import { Ellipse } from '../Ellipse';
import { Loading } from '../Loading';
import { NoData } from '../NoData';
import { CenteredSpan } from '../Text';
import { device } from '../theme';
import { ToolBar } from '../Toolbar';

export interface TableColumn {
    label: string;
    dataType?: DataTypes;
    sortOrder?: number;
    sortDirection?: SortDirection;
}

export interface TableContainerSettings {
    dataTitle?: string;
    height?: SizeValues;
    justify?: FlexValues;
}

export interface TableSettings<TDataIn, TDataOut> extends TableContainerSettings {
    rawData: TDataIn;
    dataCallback: (data: TDataIn) => TDataOut[];
    columns: TableColumn[];
    size?: SizeValues;
    loading?: boolean;
    noDataElement?: React.ReactNode;
    searchable?: boolean;
    calculateFooter?: (data: TDataIn) => (string | number)[];
    sortable?: any;
    exportCsv?: boolean;
    render?: <TIn>(data: (string | number)[], definitions: TableColumn[], rawData: TIn) => React.ReactNode;
    switchTbl?: (inputExchangeRates?: CurrencyRate[]) => void;
    isExchange?: boolean;
    useMinWidth?: boolean;
    children?: React.ReactNode;
}

interface TdSettings {
    bold?: boolean;
    color?: string;
    background?: string;
    border?: boolean;
}

interface HeaderSettings {
    sortable: boolean;
    sorted: boolean;
}

dayjs.extend(utc);

const sanitizeNumericString = (str: any) =>
    Number(str.toString().replaceAll(',', '').replaceAll('$', '').replaceAll('%', '').trim());

const compareDates = (date1: any, date2: any) => {
    if (dayjs.utc(date1).isAfter(dayjs.utc(date2), 'day')) return 1;
    if (dayjs.utc(date2).isAfter(dayjs.utc(date1), 'day')) return -1;

    return 0;
};

const compare = (a: any, b: any, sortColumn: number, definition: TableColumn[]) => {
    if (a[sortColumn] === null) return 1;
    if (b[sortColumn] === null) return -1;

    const { dataType } = definition[sortColumn];

    if (dataType === DataTypes.DATE || dataType === DataTypes.DATE_LOCAL)
        return compareDates(a[sortColumn], b[sortColumn]);

    if (
        dataType === DataTypes.NUMBER ||
        dataType === DataTypes.DECIMAL ||
        dataType === DataTypes.PERCENTAGE ||
        dataType === DataTypes.DECIMAL_PERCENTAGE ||
        dataType === DataTypes.MONEY ||
        dataType === DataTypes.DAYS ||
        dataType === DataTypes.MONTHS
    )
        return a[sortColumn] - b[sortColumn];

    if (
        (a[sortColumn].includes('$') && b[sortColumn].includes('$')) ||
        (a[sortColumn].includes('%') && b[sortColumn].includes('%'))
    ) {
        const numStrA = sanitizeNumericString(a);
        const numStrB = sanitizeNumericString(b);

        if (typeof numStrA === 'number' && typeof numStrB === 'number') return numStrA - numStrB;
    }

    return a[sortColumn]
        .toString()
        .trim()
        .localeCompare(b[sortColumn].toString().trim(), undefined, { numeric: true, sensitivity: 'base' });
};

export const sortData = (data: any, definition: TableColumn[]) => {
    const sortColumn = definition.findIndex((column) => column.sortOrder === 1);
    const sortType = sortColumn >= 0 && definition[sortColumn].sortDirection === SortDirection.ASC;

    return data.sort((a: any, b: any) => {
        if (sortColumn === -1) return 0;
        return sortType ? compare(a, b, sortColumn, definition) : compare(b, a, sortColumn, definition);
    });
};

const getSortDirection = (current?: SortDirection) =>
    current === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;

export const getColumnSorting = (prev: TableColumn[], index: number) =>
    prev.map((field, i) => ({
        ...field,
        sortOrder: i === index ? 1 : undefined,
        sortDirection: i === index ? getSortDirection(field.sortDirection) : undefined,
    }));

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    tr:first-child {
        border-top: none;
    }
    th {
        font-weight: 500;
        padding: 0px 10px 0px 6px;
    }
    tr,
    td {
        border-top: ${({ theme }) => theme.colors.table} 1px solid;
        font-size: 13px;
    }
    td {
        color: ${({ theme }) => theme.colors.tableContent};
        padding: 7px;
    }
    ${device.md} {
        td {
            font-size: 10px;
        }
        th {
            font-size: 11px;
        }
    }
    tfoot {
        position: sticky;
        inset-block-end: 0;
        background-color: white;
    }
`;

const getHeightStyle = (dataTitle: string | undefined, minValue: number, maxValue: number) => {
    const value = dataTitle ? `${minValue}vmin` : `${maxValue}vmin`;

    return `
max-height: ${value};
height: ${value};
`;
};

const calculateHeight = (height: SizeValues | undefined, dataTitle: string | undefined) => {
    switch (height) {
        case SizeValues.EXTRA_SMALL:
            return getHeightStyle(dataTitle, 16, 18);
        case SizeValues.SMALL:
            return getHeightStyle(dataTitle, 24, 26);
        case SizeValues.MEDIUM:
            return getHeightStyle(dataTitle, 55, 58);
        case SizeValues.LARGE:
            return getHeightStyle(dataTitle, 75, 79);
        default:
            return getHeightStyle(dataTitle, 69, 73);
    }
};

export const StyledTableContainer = styled.div<TableContainerSettings>`
    ${({ height, dataTitle }) => calculateHeight(height, dataTitle)};
    ${({ dataTitle }) =>
        dataTitle
            ? `
    margin: auto;
    margin-top: 0px;
    `
            : `
    margin: 0px auto;
    padding-top: 5px;
    padding-bottom: 5px;
    `};
    width: 100%;
    overflow-y: auto;
    justify-content: ${({ justify }) => justify};
`;

export const StyledTd = styled.td<TdSettings>`
    ${({ bold }) => (bold ? 'font-weight: 500; color: black !important' : 'font-weight: normal')};
    ${({ align }) => align && `text-align: ${align}`};
    ${({ color }) => color && `color: ${color} !important`};
    ${({ background }) => background && `background-color: ${background}`};
    ${({ border }) =>
        border && `border-left: 2px solid ${Colors.BORDER_GRAY}; border-right: 2px solid ${Colors.BORDER_GRAY}`};
`;

const commonProps = `
    display: inline-flex;
    margin-right: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    font-size: 14px;
    line-height: 1.5;
    font-weight: normal;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const StyledCellInput = styled.input`
    ${commonProps}
    color: #333;
    border-width: 0px;
    padding: 0.35rem;
    font-size: 13px;
    height: 8px;
    width: 90px;
    margin-right: 0;
    border-radius: 2px;
    border: solid 1px #3e4f45;
`;

export const HeaderDiv = styled.div<HeaderSettings>`
    flex: 1;
    flex-direction: row;
    display: inline-flex;
    svg {
        opacity: ${({ sorted }) => (sorted ? 1 : 0.3)};
        height: 1rem;
        width: 1rem;
        margin-left: 0.25rem;
    }
    :hover svg {
        opacity: 1;
    }
    ${({ sortable }) => (sortable ? 'cursor: pointer;' : '')}
`;

const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

const translateType = (type: DataTypes | undefined) => {
    switch (type) {
        case DataTypes.DATE:
            return FormatTypes.DATE;
        case DataTypes.DATE_LOCAL:
            return FormatTypes.DATE_LOCAL;
        case DataTypes.MONEY:
            return FormatTypes.MONEY;
        case DataTypes.PERCENTAGE:
            return FormatTypes.PERCENTAGE;
        case DataTypes.DECIMAL_PERCENTAGE:
            return FormatTypes.DECIMAL_PERCENTAGE;
        case DataTypes.DAYS:
            return FormatTypes.DAYS;
        case DataTypes.MONTHS:
            return FormatTypes.MONTHS;
        default:
            return undefined;
    }
};

const renderLinkCell = (data: any) => {
    if (!(data as string[])[1]) return 'N/A';

    return (
        <>
            <a href={(data as string[])[0].toString()} target='_blank' rel='noopener noreferrer'>
                <LinkIcon />
            </a>
            <span>{`   ${new Date((data as string[])[1].toString()).toLocaleDateString(
                'en-us',
                dateOptions as any,
            )}`}</span>
        </>
    );
};

const renderLinkString = (data: any) =>
    (data as string[])[0] ? (
        <>
            <a href={(data as string[])[0].toString()} target='_blank' rel='noopener noreferrer'>
                <span>{`${(data as string[])[1].toString()}`}</span>
            </a>
            {data[2] && <span>{` ${(data as string[])[2].toString()}`}</span>}
        </>
    ) : (
        <>
            <span>{`${(data as string[])[1].toString()}`}</span>
            {data[2] && <span>{` ${(data as string[])[2].toString()}`}</span>}
        </>
    );

const LinkIcon = (props: any) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width={15}
        height={9.315}
        {...props}
    >
        <defs>
            <title>Link</title>
            <path id='a' d='M0 0h15v9.315H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h15v9.315H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path
                fill='#304FF3'
                fillRule='evenodd'
                d='M8.313 6.26c-.4.174-.826.26-1.275.26h-.476v-.93c.375 0 .726-.038 1.063-.125s.638-.224.9-.41c.263-.186.462-.422.625-.72s.225-.659.225-1.068c0-.323-.063-.621-.188-.907a2.373 2.373 0 0 0-.5-.745 2.39 2.39 0 0 0-.75-.497 2.246 2.246 0 0 0-.9-.186h-3.75c-.325 0-.624.062-.912.186a2.39 2.39 0 0 0-.75.497c-.212.21-.375.46-.5.745a2.223 2.223 0 0 0-.188.907c0 .422.076.782.226 1.068.15.285.362.534.625.72.262.186.562.323.9.41a4.22 4.22 0 0 0 1.062.124v.932h-.462c-.45 0-.875-.087-1.275-.261-.4-.174-.75-.41-1.038-.696a3.382 3.382 0 0 1-.712-1.03A3.109 3.109 0 0 1 0 3.266C0 2.819.087 2.397.263 2A3.349 3.349 0 0 1 2 .26C2.4.088 2.825 0 3.288 0h3.75c.45 0 .875.087 1.274.26.4.175.75.41 1.038.696.288.286.525.634.7 1.031.175.398.262.82.262 1.267 0 .447-.087.87-.262 1.267A3.349 3.349 0 0 1 8.312 6.26zm2.937-2.534v-.931h.475c.45 0 .875.087 1.275.26a3.349 3.349 0 0 1 1.737 1.739c.176.398.263.82.263 1.267 0 .447-.087.87-.263 1.267a3.349 3.349 0 0 1-.7 1.03A3.373 3.373 0 0 1 13 9.055c-.4.174-.825.261-1.275.261h-3.75a3.18 3.18 0 0 1-1.287-.26c-.4-.174-.75-.41-1.038-.696a3.349 3.349 0 0 1-.7-1.031 3.067 3.067 0 0 1-.263-1.267c0-.46.088-.882.263-1.28A3.373 3.373 0 0 1 6.7 3.056c.4-.173.825-.26 1.275-.26h.463v.931a4.22 4.22 0 0 0-1.063.124 2.726 2.726 0 0 0-.9.423 2.048 2.048 0 0 0-.625.72c-.15.286-.225.646-.225 1.068 0 .31.063.634.188.907s.287.522.5.733c.212.21.462.372.75.496.287.125.587.187.912.187h3.75c.313 0 .637-.075.913-.199.275-.124.525-.286.737-.497a2.316 2.316 0 0 0 .688-1.64c0-.422-.063-.77-.226-1.067a2.065 2.065 0 0 0-.625-.72 2.704 2.704 0 0 0-.9-.41 4.22 4.22 0 0 0-1.062-.125z'
            />
        </g>
    </svg>
);

const CheckIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width={12} height={12} {...props}>
        <title>Check</title>
        <defs>
            <path id='a' d='M0 0h12v12H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h12v12H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path
                fill='#304FF3'
                fillRule='evenodd'
                d='M12 12V0H0v12h12zM9.49 3.49l.52.52L4.5 9.53 1.99 7.01l.52-.52L4.5 8.47l4.99-4.98z'
            />
        </g>
    </svg>
);

const UncheckIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width={12} height={12} {...props}>
        <title>Uncheck</title>
        <defs>
            <path id='a' d='M0 0h12v12H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h12v12H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path fill='#304FF3' fillRule='evenodd' d='M12 12V0H0v12h12zM.75.75h10.5v10.5H.75V.75z' />
        </g>
    </svg>
);

export const renderTableCell = (
    data: Record<string, unknown> | string | number | boolean | string[] | any,
    type: DataTypes | undefined,
) => {
    if (!data && type === DataTypes.MONEY) return '$0.00';
    if (data == null || data === ' ') return 'N/A';

    switch (type) {
        case DataTypes.LINK:
            return renderLinkCell(data);
        case DataTypes.LINK_ICON:
            if (!data) return '';
            return (
                <a href={data.toString()} target='_blank' rel='noopener noreferrer'>
                    <LinkIcon />
                </a>
            );
        case DataTypes.LINK_STRING:
            return renderLinkString(data);
        case DataTypes.BOOLEAN:
            return data ? <CheckIcon /> : <UncheckIcon />;
        case DataTypes.BULLET:
            return (
                <CenteredSpan>
                    <Ellipse small color={(data as string[])[1].toString()} />
                    {(data as string[])[0].toString()}
                </CenteredSpan>
            );
        default: {
            const formatType = translateType(type);
            return formatType ? formatter(data.toString(), formatType) : data;
        }
    }
};

const leftAlign = [DataTypes.STRING, DataTypes.LINK_STRING, DataTypes.BULLET, undefined];

export const getAlignment = (dataType: DataTypes | undefined, index: number) =>
    dataType === DataTypes.PARAGRAPH || (leftAlign.includes(dataType) && index === 0) ? 'left' : 'center';

const getHeaders = (
    definitions: TableColumn[],
    sortable: boolean,
    setSortColumn: (index: any) => void,
    useMinWidth: boolean | undefined,
) =>
    definitions.map((header, index) => (
        <th
            key={index}
            onClick={() => setSortColumn(index)}
            style={{
                minWidth: useMinWidth ? '100px' : '',
                textAlign: getAlignment(header.dataType, index),
            }}
        >
            <HeaderDiv sortable={sortable} sorted={header.sortOrder === index}>
                <span>{header.label}</span>
                {sortable && (
                    <span style={{ alignSelf: 'center' }}>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                            <path
                                style={{ transformOrigin: 'center' }}
                                fillRule='evenodd'
                                d='M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                                transform={
                                    header.sortDirection === SortDirection.DESC && header.sortOrder === 1
                                        ? ''
                                        : 'rotate(180,0,0)'
                                }
                            />
                        </svg>
                    </span>
                )}
            </HeaderDiv>
        </th>
    ));

const getFooter = (footer: (string | number)[], definition: TableColumn[]) =>
    footer.map((foot, index) => (
        <td key={index} style={{ textAlign: getAlignment(definition[index]?.dataType || undefined, index) }}>
            {foot}
        </td>
    ));

const getRows = (data: (string | number)[], definitions: TableColumn[], _: any) =>
    data.map((section: any, i: number) => (
        <tr key={i}>
            {section.map((cell: any, index: number) => {
                const dataType = definitions[index]?.dataType || undefined;
                return (
                    <StyledTd
                        align={getAlignment(dataType, index)}
                        key={index}
                        bold={dataType === DataTypes.BOLD_STRING}
                    >
                        {renderTableCell(cell, dataType)}
                    </StyledTd>
                );
            })}
        </tr>
    ));

const defaultFilter = (search: string) => (element: any) =>
    element && element.toString().toLowerCase().match(search.toLowerCase());

export const searchData = (search: string, newData: any) =>
    newData.filter((section: any) => section.some(defaultFilter(search)));

const searchFooter = (search: string, newRaw: any) =>
    Array.isArray(newRaw)
        ? newRaw.filter((section: any) => Object.values(section).some(defaultFilter(search)))
        : newRaw;

export const Table = <TDataIn, TDataOut>({
    columns,
    dataTitle,
    size = SizeValues.LARGE,
    justify = FlexValues.START,
    height,
    loading,
    noDataElement,
    searchable,
    calculateFooter,
    rawData,
    sortable,
    exportCsv,
    render,
    switchTbl,
    isExchange = false,
    useMinWidth,
    children,
    dataCallback,
}: TableSettings<TDataIn, TDataOut>) => {
    const dataStore = (dataCallback && rawData && dataCallback(rawData)) || [];

    const [definitions, setDefinitions] = useState(columns);
    const [filteredData, setFilteredData] = useState(dataStore);
    const [filteredFooter, setFilteredFooter] = useState(
        (calculateFooter && rawData && calculateFooter(rawData)) || [],
    );
    const [lastSearch, setLastSearch] = useState('');
    const [searched, setSearched] = useState(dataStore);

    const onSearch = !searchable
        ? undefined
        : (search: string, newData?: any, newRaw?: any) =>
              startTransition(() => {
                  setLastSearch(search);
                  const searchableRaw = newRaw || rawData;
                  setSearched(searchData(search, newData || filteredData));

                  if (calculateFooter && searchableRaw) {
                      setFilteredFooter(calculateFooter(searchFooter(search, searchableRaw)));
                  }
              });

    useEffect(() => {
        const subSet = (dataCallback && rawData && dataCallback(rawData)) || [];

        setFilteredData(subSet);
        setSearched(lastSearch ? searchData(lastSearch, subSet) : subSet);

        if (calculateFooter && rawData) {
            setFilteredFooter(calculateFooter(lastSearch ? searchFooter(lastSearch, rawData) : rawData));
        }
    }, [calculateFooter, lastSearch, rawData, dataCallback]);

    useEffect(() => setDefinitions(columns), [columns]);

    const setSortHeader = (index: number) => setDefinitions((prev: TableColumn[]) => getColumnSorting(prev, index));

    const onCsvClick = !exportCsv
        ? undefined
        : () =>
              createCsv(
                  dataStore,
                  definitions.map((x) => x.label),
                  dataTitle || 'file',
              );

    const renderFunc = render || getRows;

    return (
        <CardContent direction={Directions.COLUMN} size={size} justify={justify}>
            {(dataTitle || searchable) && (
                <ToolBar
                    dataTitle={dataTitle}
                    isExchange={isExchange}
                    switchTbl={switchTbl}
                    onCsvClick={onCsvClick}
                    onSearch={onSearch}
                >
                    {children}
                </ToolBar>
            )}
            <StyledTableContainer dataTitle={dataTitle} height={height} justify={justify}>
                {loading && <Loading />}
                {searched.length > 0 && !loading && (
                    <StyledTable>
                        <thead>
                            <tr>{getHeaders(definitions, sortable, setSortHeader, useMinWidth)}</tr>
                        </thead>
                        <tbody>
                            {renderFunc(sortable ? sortData(searched, definitions) : searched, definitions, rawData)}
                        </tbody>
                        <tfoot>
                            <tr>{getFooter(filteredFooter, definitions)}</tr>
                        </tfoot>
                    </StyledTable>
                )}
                {searched.length <= 0 && !loading && <NoData>{noDataElement}</NoData>}
            </StyledTableContainer>
        </CardContent>
    );
};
