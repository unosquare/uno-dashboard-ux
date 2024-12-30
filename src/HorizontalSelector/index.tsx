import { ChevronLeft20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import { Flex, Text } from '@tremor/react';
import React, { type PropsWithChildren } from 'react';
import { StyledButtonContainer, StyledValueContainer } from './styled';

export type HorizontalSelectorSettings = {
    label: string;
    onValueChange: (isNext: boolean) => void;
};

export default ({ children, label, onValueChange }: PropsWithChildren<HorizontalSelectorSettings>) => (
    <Flex justifyContent='between' alignItems='center' className='gap-4'>
        <Text>{label}</Text>
        <StyledButtonContainer>
            <ChevronLeft20Regular
                className='text-tremor-content dark:text-dark-tremor-content cursor-pointer'
                data-testid='left-chevron'
                onClick={() => onValueChange(false)}
            />
            <StyledValueContainer>{children}</StyledValueContainer>
            <ChevronRight20Regular
                className='text-tremor-content dark:text-dark-tremor-content cursor-pointer'
                data-testid='right-chevron'
                onClick={() => onValueChange(true)}
            />
        </StyledButtonContainer>
    </Flex>
);
