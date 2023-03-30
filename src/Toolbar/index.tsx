import * as React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import { ActionButton, ActionButtonContainer } from '../ActionButton';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';
import { SelectSettings, TableSelect } from '../TableSelect';
import { ToggleButton } from '../ToggleButton';

export interface ToolBarSettings {
    dataTitle?: string;
    isExchange?: boolean;
    children?: React.ReactNode;
    switchTbl?: () => void;
    onCsvClick?: () => void;
    onSearch?: (search: string, newData?: any, newRaw?: any) => void;
    exportCsvDisabled?: boolean;
}

export interface TableTitleSettings {
    rightAlign?: boolean;
    margin?: boolean;
}

const StyledTableTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 50px;
`;

const StyledTableTitle = tw.p<TableTitleSettings>`
    m-0
    mb-10
    ${({ margin }) => (margin ? 'mt-auto' : 'mt-0')};
    ${({ rightAlign }) => (rightAlign ? 'text-right' : 'text-left')};
    text-gray-700
    text-base
    font-medium
    block
`;

const SearchboxContainer = styled.div`
    margin-bottom: 1.5rem;
    margin-right: 2.5rem;
    width: 250px;
    min-width: 90px;
    display: flex;
    align-items: center;
    justify-content: end;
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
        {dataTitle && <StyledTableTitle>{dataTitle}</StyledTableTitle>}
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
