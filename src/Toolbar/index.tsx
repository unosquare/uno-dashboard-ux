import * as React from 'react';
import { Flex, Title, Toggle, ToggleItem } from '@tremor/react';
import { Money16Regular, Table16Regular } from '@fluentui/react-icons';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';

export interface ToolBarSettings {
    dataTitle?: string;
    isExchange?: boolean;
    children?: React.ReactNode;
    switchTbl?: () => void;
    onCsvClick?: () => void;
    onSearch?: (search: string, newData?: any, newRaw?: any) => void;
    exportCsvDisabled?: boolean;
}

export const ToolBar = ({
    dataTitle,
    switchTbl,
    isExchange,
    onCsvClick,
    onSearch,
    children,
    exportCsvDisabled,
}: ToolBarSettings) => (
    <Flex justifyContent='between' className='h-fit'>
        {dataTitle && <Title>{dataTitle}</Title>}
        {(onSearch || onCsvClick || switchTbl || children) && (
            <Flex className='w-2/4 gap-2'>
                {children}
                {switchTbl && (
                    <Toggle defaultValue={isExchange ? '1' : '0'} onValueChange={switchTbl}>
                        <ToggleItem value='0' icon={Table16Regular} />
                        <ToggleItem value='1' icon={Money16Regular} />
                    </Toggle>
                )}
                {onCsvClick && <ExportCsvButton onClick={onCsvClick} disable={exportCsvDisabled} />}
                {onSearch && <SearchBox search={onSearch} />}
            </Flex>
        )}
    </Flex>
);
