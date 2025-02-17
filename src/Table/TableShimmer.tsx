import { v4 as uuidv4 } from 'uuid';
import { TableCell } from '../TableCell';
import { TableRow } from './TableRow';

export const ShimmerTable = ({ colSpan }: { colSpan: number }) =>
    Array.from({ length: 4 }).map(() => (
        <TableRow key={uuidv4()}>
            {Array.from({ length: colSpan }).map(() => (
                <TableCell key={uuidv4()}>
                    <div className='loading-shimmer rounded-sm'>&nbsp;</div>
                </TableCell>
            ))}
        </TableRow>
    ));
