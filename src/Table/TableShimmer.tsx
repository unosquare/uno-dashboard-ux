import React from 'react';
import { TableRow, TableCell as TremorTableCell } from '@tremor/react';

export const ShimmerTable = ({ colSpan }: { colSpan: number }) =>
    Array.from({ length: 4 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableRow key={i}>
            {Array.from({ length: colSpan }).map((_o, k) => (
                // eslint-disable-next-line react/no-array-index-key
                <TremorTableCell className='p-2' key={k}>
                    <div className='loading-shimmer rounded'>&nbsp;</div>
                </TremorTableCell>
            ))}
        </TableRow>
    ));
