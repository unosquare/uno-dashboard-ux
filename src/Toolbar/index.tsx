import * as React from 'react';
import styled from 'styled-components';
import { ActionButton, ActionButtonContainer, imgStyle } from '../ActionButton';
import { ExportCsvButton } from '../ExportCsvButton';
import { SearchBox } from '../SearchBox';
import { SelectSettings, TableSelect } from '../TableSelect';

export interface ToolBarSettings {
    dataTitle?: string;
    isExchange?: boolean;
    children?: React.ReactNode;
    switchTbl?: () => void;
    onCsvClick?: () => void;
    onSearch?: (search: string, newData?: any, newRaw?: any) => void;
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

const StyledTableTitle = styled.h6<TableTitleSettings>`
    margin: 0px;
    font-size: 16px;
    width: 65%;
    height: 20px;
    text-align: start;
    margin-bottom: 10px;
    margin-right: ${({ margin }) => (margin ? 'auto' : '0px')};
    text-align: ${({ rightAlign }) => (rightAlign ? 'right' : 'left')};
    font-weight: 500;
    display: block;
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

export const ToggleOnIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12' {...props}>
        <title>On</title>
        <path
            d='M3 1.5c.207 0 .401.039.583.117.182.078.341.186.478.322.136.137.244.296.322.478.078.182.117.376.117.583 0 .207-.039.401-.117.583a1.525 1.525 0 0 1-.322.478 1.525 1.525 0 0 1-.478.322A1.463 1.463 0 0 1 3 4.5c-.207 0-.401-.039-.583-.117a1.525 1.525 0 0 1-.478-.322 1.525 1.525 0 0 1-.322-.478A1.463 1.463 0 0 1 1.5 3c0-.207.039-.401.117-.583.078-.182.186-.341.322-.478.137-.136.296-.244.478-.322.182-.078.376-.117.583-.117Zm6 3.75c.309 0 .6-.059.873-.176a2.27 2.27 0 0 0 1.201-1.198c.117-.272.176-.564.176-.876 0-.309-.059-.6-.176-.873A2.27 2.27 0 0 0 9.873.926 2.193 2.193 0 0 0 9 .75H3c-.312 0-.604.059-.876.176A2.27 2.27 0 0 0 .926 2.127 2.193 2.193 0 0 0 .75 3c0 .312.059.604.176.876a2.28 2.28 0 0 0 1.198 1.198c.272.117.564.176.876.176h6ZM12 3c0 .414-.078.804-.234 1.169-.157.365-.37.684-.642.955-.271.272-.59.485-.955.642A2.944 2.944 0 0 1 9 6H3c-.414 0-.804-.078-1.169-.234a3.012 3.012 0 0 1-.955-.642 3.012 3.012 0 0 1-.642-.955A2.944 2.944 0 0 1 0 3c0-.414.078-.804.234-1.169.157-.365.37-.684.642-.955.271-.272.59-.485.955-.642A2.944 2.944 0 0 1 3 0h6c.414 0 .804.078 1.169.234.365.157.684.37.955.642.272.271.485.59.642.955.156.365.234.755.234 1.169Z'
            fill='#000'
            fillRule='evenodd'
        />
    </svg>
);

export const ToggleOffIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' {...props}>
        <title>Off</title>
        <path
            d='M9 1.5c-.207 0-.401.039-.583.117a1.525 1.525 0 0 0-.478.322 1.525 1.525 0 0 0-.322.478A1.463 1.463 0 0 0 7.5 3c0 .207.039.401.117.583.078.182.186.341.322.478.137.136.296.244.478.322.182.078.376.117.583.117.207 0 .401-.039.583-.117.182-.078.341-.186.478-.322.136-.137.244-.296.322-.478.078-.182.117-.376.117-.583 0-.207-.039-.401-.117-.583a1.525 1.525 0 0 0-.322-.478 1.525 1.525 0 0 0-.478-.322A1.463 1.463 0 0 0 9 1.5ZM3 5.25c-.309 0-.6-.059-.873-.176A2.27 2.27 0 0 1 .926 3.876 2.193 2.193 0 0 1 .75 3c0-.309.059-.6.176-.873A2.27 2.27 0 0 1 2.127.926C2.4.809 2.691.75 3 .75h6c.312 0 .604.059.876.176a2.27 2.27 0 0 1 1.198 1.201c.117.273.176.564.176.873 0 .312-.059.604-.176.876a2.28 2.28 0 0 1-1.198 1.198A2.193 2.193 0 0 1 9 5.25H3ZM0 3c0 .414.078.804.234 1.169.157.365.37.684.642.955.271.272.59.485.955.642C2.196 5.922 2.586 6 3 6h6c.414 0 .804-.078 1.169-.234.365-.157.684-.37.955-.642.272-.271.485-.59.642-.955C11.922 3.804 12 3.414 12 3c0-.414-.078-.804-.234-1.169a3.012 3.012 0 0 0-.642-.955 3.012 3.012 0 0 0-.955-.642A2.944 2.944 0 0 0 9 0H3c-.414 0-.804.078-1.169.234-.365.157-.684.37-.955.642-.272.271-.485.59-.642.955A2.944 2.944 0 0 0 0 3Z'
            fill='#304FF3'
            fillRule='evenodd'
        />
    </svg>
);

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

export const ToolBar = ({ dataTitle, switchTbl, isExchange, onCsvClick, onSearch, children }: ToolBarSettings) => {
    const onSwitchTblClick = () => {
        if (switchTbl) switchTbl();
    };

    return (
        <StyledTableTitleContainer>
            {dataTitle && <StyledTableTitle>{dataTitle}</StyledTableTitle>}
            {(onSearch || onCsvClick || switchTbl || children) && (
                <div style={containerStyle}>
                    {children}
                    {switchTbl && (
                        <ActionButtonContainer>
                            <ActionButton width='max-content' type='button' onClick={onSwitchTblClick}>
                                {isExchange ? <ToggleOffIcon {...imgStyle} /> : <ToggleOnIcon {...imgStyle} />}
                                {isExchange ? 'Back to Data' : 'Exchange Rate'}
                            </ActionButton>
                        </ActionButtonContainer>
                    )}
                    {onCsvClick && <ExportCsvButton onClick={onCsvClick} />}
                    {onSearch && (
                        <SearchboxContainer>
                            <SearchBox search={onSearch} />
                        </SearchboxContainer>
                    )}
                </div>
            )}
        </StyledTableTitleContainer>
    );
};
