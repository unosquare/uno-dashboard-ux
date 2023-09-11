import React from 'react';
import { CloudArrowDown16Regular } from '@fluentui/react-icons';
import { Button } from '@tremor/react';

type ExportCsvButtonProps = {
    onClick: () => void;
    text?: string;
    disabled?: boolean;
};

export const ExportCsvButton = ({ onClick, text = 'Export', disabled }: ExportCsvButtonProps) => (
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
