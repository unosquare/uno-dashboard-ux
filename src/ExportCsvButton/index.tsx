import React from 'react';
import { ActionButton, ActionButtonContainer, imgStyle } from '../ActionButton';

export const ExportCsvIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12' {...props}>
        <title>Export CSV</title>
        <path
            d='M0 9.75h12V0H0v9.75Zm.75-7.5h10.5V.75H.75v1.5ZM.75 9h10.5V3H.75v6ZM6 8.25h.75v-4.5H6v4.5Zm3 0h.75V4.501H9V8.25Zm-7.5 0h.75V4.501H1.5V8.25Zm6 0h.751V6H7.5v2.25Zm-3 0h.75V6H4.5v2.25Zm-1.5 0h.751V6.751H3V8.25Z'
            fill='#304FF3'
            fillRule='evenodd'
        />
    </svg>
);

export const ExportCsvButton = ({ onClick, text = 'Export to CSV', disable = false }: any) => (
    <ActionButtonContainer>
        <ActionButton width='100px' type='button' onClick={onClick} disabled={disable} fitContent>
            <ExportCsvIcon {...imgStyle} />
            {text}
        </ActionButton>
    </ActionButtonContainer>
);
