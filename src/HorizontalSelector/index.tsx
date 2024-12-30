import { ChevronLeft20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import { Flex, Text } from '@tremor/react';
import type React from 'react';
import { StyledButtonContainer, StyledValueContainer } from './styled';

interface HorizontalSelectorSettings {
    children: React.ReactNode;
    label: string;
    onValueChange: (isNext: boolean) => void;
}

export default ({ children, label, onValueChange }: HorizontalSelectorSettings) => (
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
