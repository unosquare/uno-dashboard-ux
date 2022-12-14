import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { startTransition, useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { createCsv, formatter, FormatTypes } from 'uno-js';
import {
    CaretDown12Regular,
    CaretUp12Regular,
    CheckboxChecked16Regular,
    CheckboxUnchecked16Regular,
    Link16Regular,
} from '@fluentui/react-icons';
import objectHash from 'object-hash';
import { CardContent } from '../Card';
import { Colors, CurrencyRate, DataTypes, Directions, FlexValues, SizeValues, SortDirection } from '../constants';
import { Ellipse } from '../Ellipse';
import { Loading } from '../Loading';
import { NoData } from '../NoData';
import { CenteredSpan } from '../Text';
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
    color?: string;
    background?: string;
    border?: boolean;
    type?: DataTypes;
    index?: number;
}

interface HeaderSettings {
    $sortable: boolean;
    $sorted: boolean;
}

dayjs.extend(utc);

const sanitizeNumericString = (str: any) =>
    Number(str.toString().replaceAll(',', '').replaceAll('$', '').replaceAll('%', '').trim());

const compareDates = (date1: any, date2: any) => {
    if (dayjs.utc(date1).isAfter(dayjs.utc(date2), 'day')) return 1;
    if (dayjs.utc(date2).isAfter(dayjs.utc(date1), 'day')) return -1;

    return 0;
};

const dateType = [DataTypes.DATE, DataTypes.DATE_LOCAL];

const numericTypes = [
    DataTypes.NUMBER,
    DataTypes.DECIMAL,
    DataTypes.PERCENTAGE,
    DataTypes.DECIMAL_PERCENTAGE,
    DataTypes.MONEY,
    DataTypes.DAYS,
    DataTypes.MONTHS,
    DataTypes.BOOLEAN,
];

const checkNumericString = (a: any, b: any, sortColumn: number) => {
    if (
        (a[sortColumn].toString().includes('$') && b[sortColumn].toString().includes('$')) ||
        (a[sortColumn].toString().includes('%') && b[sortColumn].toString().includes('%'))
    ) {
        const numStrA = sanitizeNumericString(a[sortColumn]);
        const numStrB = sanitizeNumericString(b[sortColumn]);

        if (typeof numStrA === 'number' && typeof numStrB === 'number') {
            const result = numStrA - numStrB;
            if (result !== 0) return result;
        }
    }

    return 0;
};

export const sortData = (data: any[], definition: TableColumn[]) => {
    data.sort((left: any, right: any) => {
        const sortColumns = definition
            .filter((x) => x.sortOrder && x.sortOrder >= 1)
            .sort((x, y) => Number(x.sortOrder) - Number(y.sortOrder));

        for (const index in sortColumns) {
            const { sortOrder, dataType, sortDirection } = sortColumns[index];
            const sortColumn = definition.findIndex((x) => x.sortOrder === sortOrder);

            if (left[sortColumn] === null) return 1;
            if (right[sortColumn] === null) return -1;

            const a = sortDirection === SortDirection.DESC ? right : left;
            const b = sortDirection === SortDirection.DESC ? left : right;

            if (dateType.some((x) => x === dataType)) {
                const result = compareDates(a[sortColumn], b[sortColumn]);

                if (result !== 0) return result;
            }

            if (numericTypes.some((x) => x === dataType)) {
                const result = a[sortColumn] - b[sortColumn];

                if (result !== 0) return result;
            }

            const resultNumericString = checkNumericString(a, b, sortColumn);

            if (resultNumericString !== 0) return resultNumericString;

            const result = a[sortColumn]
                .toString()
                .trim()
                .localeCompare(b[sortColumn].toString().trim(), undefined, { numeric: true, sensitivity: 'base' });

            if (result !== 0) return result;
        }

        return 0;
    });

    return data;
};

const getSortDirection = (current?: SortDirection) =>
    current === SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC;

export const getColumnSorting = (prev: TableColumn[], index: number) =>
    prev.map((field, i) => ({
        ...field,
        sortOrder: i === index ? 1 : undefined,
        sortDirection: i === index ? getSortDirection(field.sortDirection) : undefined,
    }));

const leftAlign = [DataTypes.STRING, DataTypes.LINK_STRING, DataTypes.BULLET, undefined];

export const getAlignment = (dataType: DataTypes | undefined, index?: number) =>
    dataType === DataTypes.PARAGRAPH || (leftAlign.includes(dataType) && index === 0) ? 'text-left' : 'text-center';

export const StyledTable = tw.table<any>`
    w-full
    border-collapse
    [&_tr:first-child]:border-t-0
    [&_th]:font-medium
    [&_th]:p-[0_10px_0_6px]
    [&_tr]:border-table
    [&_tr]:text-[13px]
    [&_td]:text-unogray
    [&_td]:border-table
    [&_td]:p-[7px]
    [&_tfoot]:bg-white
    [&_tfoot]:sticky
    [&>tfoot]:inset-y-0
    md:[&_td]:text-[10px]
    md:[&_th]:text-[11px]
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

export const TableContainerBase = styled.div<TableContainerSettings>`
    ${({ height, dataTitle }) => calculateHeight(height, dataTitle)};
    justify-content: ${({ justify }) => justify};
`;

export const StyledTableContainer = tw(TableContainerBase)<TableContainerSettings>`
    ${({ dataTitle }) => (dataTitle ? 'm-auto mt-0' : 'my-0 mx-auto py-[5px]')}
    w-full
    overflow-y-auto
`;

export const TdBase = styled.td<TdSettings>`
    ${({ color }) => color && `color: ${color} !important`};
    ${({ background }) => background && `background-color: ${background}`};
    ${({ border }) =>
        border && `border-left: 2px solid ${Colors.BORDER_GRAY}; border-right: 2px solid ${Colors.BORDER_GRAY}`};
`;

export const StyledTd = tw(TdBase)<TdSettings>`
    ${({ type }) => (type === DataTypes.BOLD_STRING ? 'font-medium !text-black' : 'font-normal')};
    ${({ type, index }) => getAlignment(type, index)};
`;

export const StyledCellInput = tw.input`
    inline-flex
    items-center
    text-sm
    leading-normal
    font-sans
    text-maingray
    p-[0.35rem]
    text-[13px]
    h-2
    w-[90px]
    mr-0
    rounded-sm
    border-solid
    border-[1px]
    border-[#3e4f45]
`;

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
                <Link16Regular />
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
                    <Link16Regular />
                </a>
            );
        case DataTypes.LINK_STRING:
            return renderLinkString(data);
        case DataTypes.BOOLEAN:
            return data ? <CheckboxChecked16Regular /> : <CheckboxUnchecked16Regular />;
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

const getHeaders = (
    definitions: TableColumn[],
    sortable: boolean,
    setSortColumn: (index: any) => void,
    useMinWidth: boolean | undefined,
) =>
    definitions.map((header, index) => (
        <th
            key={objectHash(header)}
            onClick={() => setSortColumn(index)}
            className={`${useMinWidth && 'min-w-[100px]'} ${getAlignment(header.dataType, index)}`}
        >
            <HeaderDiv $sortable={sortable} $sorted={Number(header.sortOrder) >= 1}>
                <span>{header.label}</span>
                {sortable &&
                    (header.sortDirection === SortDirection.DESC && Number(header.sortOrder) >= 1 ? (
                        <CaretDown12Regular />
                    ) : (
                        <CaretUp12Regular />
                    ))}
            </HeaderDiv>
        </th>
    ));

const getFooter = (footer: (string | number)[], definition: TableColumn[]) =>
    footer.map((foot, index) => (
        <td
            key={objectHash(definition[index])}
            className={getAlignment(definition[index]?.dataType || undefined, index)}
        >
            {foot}
        </td>
    ));

const getRows = (data: (string | number)[], definitions: TableColumn[]) =>
    data.map((section: any, i: number) => (
        <tr key={objectHash(section)}>
            {section.map((cell: any, index: number) => {
                const dataType = definitions[index]?.dataType || undefined;
                return (
                    <StyledTd key={objectHash(dataType || cell)} index={index} type={dataType}>
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
