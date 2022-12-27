import React from 'react';
import { DocumentTable16Regular } from '@fluentui/react-icons';
import { ActionButton, ActionButtonContainer } from '../ActionButton';

export const ExportCsvButton = ({ onClick, text = 'Export to CSV', disable = false }: any) => (
    <ActionButtonContainer>
        <ActionButton width='100px' type='button' onClick={onClick} disabled={disable} fitContent>
            <DocumentTable16Regular primaryFill='#304FF3' />
            {text}
        </ActionButton>
    </ActionButtonContainer>
);
