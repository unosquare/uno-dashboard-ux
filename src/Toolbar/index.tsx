import * as React from 'react';
import { Button, Flex } from '@tremor/react';
import { Money16Regular, Table16Regular } from '@fluentui/react-icons';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';

export interface ToolBarSettings {
    children?: React.ReactNode;
    onCsvClick?: () => void;
    onSearch?: (search: string, newData?: any, newRaw?: any) => void;
    exportCsvDisabled?: boolean;
}

export interface ExchangeToggleSettings {
    isExchange: boolean;
    switchTbl: () => void;
}

export const ExchangeToggle = ({ isExchange, switchTbl }: ExchangeToggleSettings) => (
    <Button onClick={switchTbl} className='mx-3' icon={isExchange ? Table16Regular : Money16Regular}>
        {isExchange ? 'Data' : 'Exchange'}
    </Button>
);

export const ToolBar = ({ onCsvClick, onSearch, children, exportCsvDisabled }: ToolBarSettings) => (
    <Flex justifyContent='end' className='gap-4'>
        {children}
        {onCsvClick && (
            <ExportCsvButton
                onClick={onCsvClick}
                disable={exportCsvDisabled ? true : undefined}
                className='sm:hidden'
            />
        )}
        {onSearch && <SearchBox search={onSearch} />}
    </Flex>
);
