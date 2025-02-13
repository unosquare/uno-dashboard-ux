import { CaretDown12Regular, CaretUp12Regular } from '@fluentui/react-icons';
import tw from 'tailwind-styled-components';
import type { SortDirection, TableColumn } from '../constants';
import { getAlignment } from '../utils';
import { TableHead } from './TableHead';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';

type HeaderSettings = {
    $sortable: boolean;
    $sorted: boolean;
};

const HeaderDiv = tw.div<HeaderSettings>`
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

export const TableHeaders = ({ definitions, sortable, setSortColumn }: TableHeadersProps) => (
    <TableHead>
        <TableRow>
            {definitions.map((header, index) => (
                <TableHeaderCell
                    key={header.label}
                    className={`bg-tremor-background dark:bg-dark-tremor-background ${getAlignment(header, index)}`}
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
