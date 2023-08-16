import { Flex } from '@tremor/react';
import React from 'react';

export const CardLoading = () => (
    <Flex className='w-full h-full max-h-[200px] max-w-[200px]' alignItems='center'>
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
            <circle
                cx='50'
                cy='50'
                r='25'
                fill='none'
                stroke='#304FF3'
                strokeWidth='2'
                strokeDasharray='100'
                strokeDashoffset='50'
                fillOpacity='0.5'
            >
                <animate attributeName='stroke-dashoffset' dur='2s' values='50;0' fill='freeze' />
            </circle>
        </svg>
    </Flex>
);
