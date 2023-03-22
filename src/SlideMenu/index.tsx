import React from 'react';
import tw from 'tailwind-styled-components';
import { ChevronLeft20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import { StyledButtonContainer, StyledMenuSelector, StyledTitle } from '../DropdownMenu';

export interface SliderMenuSettings {
    label: string;
    value: string | number;
    onNavigate: (forward: boolean) => () => void;
    leftDisabled?: boolean;
    rightDisabled?: boolean;
    className?: string;
}

const StyledYear = tw.span`
    font-medium
    text-center
    mx-auto
`;

export const SlideMenu = ({ label, value, onNavigate, leftDisabled, rightDisabled, className }: SliderMenuSettings) => (
    <StyledMenuSelector className={className}>
        <StyledTitle>{label}</StyledTitle>
        <StyledButtonContainer>
            <ChevronLeft20Regular primaryFill={leftDisabled ? '#333' : '#304FF3'} onClick={onNavigate(false)} />
            <StyledYear>{value}</StyledYear>
            <ChevronRight20Regular primaryFill={rightDisabled ? '#333' : '#304FF3'} onClick={onNavigate(true)} />
        </StyledButtonContainer>
    </StyledMenuSelector>
);
