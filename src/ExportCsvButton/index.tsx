import React from 'react';
import { DocumentTable16Regular } from '@fluentui/react-icons';
import { Button } from '@tremor/react';

export const ExportCsvButton = ({ onClick, text = 'Export to CSV', disable = false }: any) => (
    <Button size='xs' icon={DocumentTable16Regular} onClick={onClick} disabled={disable}>
        {text}
    </Button>
);
