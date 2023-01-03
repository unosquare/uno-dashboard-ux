import objectHash from 'object-hash';
import React from 'react';
import styled from 'styled-components';

export interface SelectSettings {
    label?: string;
    options: {
        label: string;
        value: any;
    }[];
    handler: (e: any) => void;
    selected: any;
    styles?: any;
}

const StyledTableSelect = styled.div`
    select {
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 5px;
        border-radius: 5px;
        :active,
        :focus {
            outline: none;
        }
    }
    option {
        font-size: 14px;
    }
    label {
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;

export const TableSelect = ({ label, options, handler, selected, styles }: SelectSettings) => (
    <StyledTableSelect>
        <select name='selector' id='selector' onChange={handler} value={selected} style={styles}>
            {[...options].map((option: any) => (
                <option key={objectHash(option)} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {label && (
            <label htmlFor='selector' style={{ marginLeft: '5px' }}>
                {label}
            </label>
        )}
    </StyledTableSelect>
);
