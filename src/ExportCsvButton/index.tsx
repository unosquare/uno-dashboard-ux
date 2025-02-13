import { CloudArrowDown16Regular } from '@fluentui/react-icons';
import { Button } from '@tremor/react';

type ExportCsvButtonProps = {
    onClick: () => void;
    text?: string;
    disabled?: boolean;
    loading?: boolean;
};

export const ExportCsvButton = ({ onClick, text = 'Export', disabled, loading }: ExportCsvButtonProps) => (
    <Button
        size='xs'
        variant='light'
        icon={CloudArrowDown16Regular}
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        className='sm:hidden'
    >
        {text}
    </Button>
);
