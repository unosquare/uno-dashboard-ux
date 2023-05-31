import * as React from 'react';
import { Flex, Toggle, ToggleItem } from '@tremor/react';
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
    <Toggle defaultValue={isExchange ? '1' : '0'} onValueChange={switchTbl} className='mx-3'>
        <ToggleItem value='0' icon={Table16Regular} title='Data' />
        <ToggleItem value='1' icon={Money16Regular} title='Exchange' />
    </Toggle>
);

export const ToolBar = ({ onCsvClick, onSearch, children, exportCsvDisabled }: ToolBarSettings) => (
    <Flex justifyContent='between'>
        {children}
        {(onSearch || onCsvClick) && (
            <Flex className='w-2/4 gap-2'>
                {onCsvClick && (
                    <ExportCsvButton onClick={onCsvClick} disable={exportCsvDisabled} className='sm:hidden' />
                )}
                {onSearch && <SearchBox search={onSearch} />}
            </Flex>
        )}
    </Flex>
);
