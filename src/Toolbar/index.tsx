import * as React from 'react';
import tw from 'tailwind-styled-components';
import { ActionButton, ActionButtonContainer } from '../ActionButton';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';
import { SelectSettings, TableSelect } from '../TableSelect';
import { ToggleButton } from '../ToggleButton';
import { SubTitle } from '../Text';

export interface ToolBarSettings {
    dataTitle?: string;
    isExchange?: boolean;
    children?: React.ReactNode;
    switchTbl?: () => void;
    onCsvClick?: () => void;
    onSearch?: (search: string, newData?: any, newRaw?: any) => void;
    exportCsvDisabled?: boolean;
}

const StyledTableTitleContainer = tw.div`
    flex 
    flex-row 
    justify-between 
    w-full 
    h-12
`;

const SearchboxContainer = tw.div`
    mb-6 
    mr-10 
    w-64 
    flex 
    items-center
    justify-end
    min-w-[90px]
`;

export const ToolBarSelect = ({ label, options, handler, selected, styles }: SelectSettings) => (
    <ActionButtonContainer>
        <ActionButton width='max-content' ignoreFocus>
            <TableSelect label={label} options={options} handler={handler} selected={selected} styles={styles} />
        </ActionButton>
    </ActionButtonContainer>
);

const containerStyle = {
    width: '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
};

export const ToolBar = ({
    dataTitle,
    switchTbl,
    isExchange,
    onCsvClick,
    onSearch,
    children,
    exportCsvDisabled,
}: ToolBarSettings) => (
    <StyledTableTitleContainer>
        {dataTitle && <SubTitle>{dataTitle}</SubTitle>}
        {(onSearch || onCsvClick || switchTbl || children) && (
            <div style={containerStyle}>
                {children}
                {switchTbl && (
                    <ToggleButton
                        value={isExchange}
                        rightLabel='Back to Data'
                        leftLabel='Exchange Rate'
                        onClick={switchTbl}
                    />
                )}
                {onCsvClick && <ExportCsvButton onClick={onCsvClick} disable={exportCsvDisabled} />}
                {onSearch && (
                    <SearchboxContainer>
                        <SearchBox search={onSearch} />
                    </SearchboxContainer>
                )}
            </div>
        )}
    </StyledTableTitleContainer>
);
