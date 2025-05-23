import { ChevronLeft20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import type { PropsWithChildren } from 'react';
import { Flex } from '../Flex';
import { Text } from '../TextElements';
import { StyledButtonContainer, StyledValueContainer } from './styled';

export type HorizontalSelectorSettings = {
    label: string;
    onValueChange: (isNext: boolean) => void;
};

export const HorizontalSelector = ({
    children,
    label,
    onValueChange,
}: PropsWithChildren<HorizontalSelectorSettings>) => (
    <Flex justifyContent='between' alignItems='center' className='gap-4'>
        <Text>{label}</Text>
        <StyledButtonContainer>
            <ChevronLeft20Regular
                className='text-unodashboard-content dark:text-dark-unodashboard-content cursor-pointer'
                data-testid='left-chevron'
                onClick={() => onValueChange(false)}
            />
            <StyledValueContainer>{children}</StyledValueContainer>
            <ChevronRight20Regular
                className='text-unodashboard-content dark:text-dark-unodashboard-content cursor-pointer'
                data-testid='right-chevron'
                onClick={() => onValueChange(true)}
            />
        </StyledButtonContainer>
    </Flex>
);
