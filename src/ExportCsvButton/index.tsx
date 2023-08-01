import React from 'react';
import { CloudArrowDown16Regular } from '@fluentui/react-icons';
import { Button } from '@tremor/react';

export const ExportCsvButton = ({ onClick, text = 'Export', disabled }: any) => (
    <Button
        size='xs'
        variant='light'
        icon={CloudArrowDown16Regular}
        onClick={onClick}
        disabled={disabled}
        className='sm:hidden'
    >
        {text}
    </Button>
);
