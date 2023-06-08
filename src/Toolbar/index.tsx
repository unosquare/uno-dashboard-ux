import * as React from 'react';
import { Button } from '@tremor/react';
import { Money16Regular, Table16Regular } from '@fluentui/react-icons';

export interface ExchangeToggleSettings {
    isExchange: boolean;
    switchTbl: () => void;
}

export const ExchangeToggle = ({ isExchange, switchTbl }: ExchangeToggleSettings) => (
    <Button onClick={switchTbl} className='mx-3' icon={isExchange ? Table16Regular : Money16Regular}>
        {isExchange ? 'Data' : 'Exchange'}
    </Button>
);
