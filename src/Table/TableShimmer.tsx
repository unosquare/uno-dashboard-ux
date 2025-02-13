import { TableRow, TableCell as TremorTableCell } from '@tremor/react';
import { v4 as uuidv4 } from 'uuid';

export const ShimmerTable = ({ colSpan }: { colSpan: number }) =>
    Array.from({ length: 4 }).map(() => (
        <TableRow key={uuidv4()}>
            {Array.from({ length: colSpan }).map(() => (
                <TremorTableCell className='p-2' key={uuidv4()}>
                    <div className='loading-shimmer rounded'>&nbsp;</div>
                </TremorTableCell>
            ))}
        </TableRow>
    ));
