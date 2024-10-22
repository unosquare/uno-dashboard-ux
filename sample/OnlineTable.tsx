import React, { useState } from 'react';
import { Title } from '@tremor/react';
import { Table, TableColumn, TableCell } from '../src';

type onlineDto = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const onlineColumns: TableColumn[] = [
    { label: 'User Id' },
    { label: 'Id', sortOrder: 1, sortDirection: 'asc', dataType: 'number' },
    {
        label: 'Title',
        render: (column, { columnIndex, rowIndex }, data, rawData) => (
            <TableCell key={column.label} column={column} index={columnIndex} className='bg-gray-100'>
                {rawData && (
                    <a href={`https://jsonplaceholder.typicode.com/posts/${rawData[rowIndex].id}`}>{String(data)}</a>
                )}
            </TableCell>
        ),
    },
    { label: 'Body' },
];

export default () => {
    const [onlineData, setOnlineData] = useState<onlineDto[]>();

    React.useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((r) => r.json())
            .then(setOnlineData);
    }, []);

    return (<Table className='h-96' columns={onlineColumns} rawData={onlineData} searchable>
        <Title className='w-full'>Online Data</Title>
    </Table>);
};

