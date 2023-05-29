import React from 'react';
import tw from 'tailwind-styled-components';
import { ChevronLeft20Regular, ChevronRight20Regular } from '@fluentui/react-icons';
import { Text } from '@tremor/react';

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

interface ContainerSettings {
    $extraBottom?: boolean;
}

const StyledMenuSelector = tw.div<ContainerSettings>`
    w-full
    p-0
    m-0
    mb-[1px]
    bg-unolightgray
    flex
    items-center
    justify-center
    ${({ $extraBottom }) => $extraBottom && 'mb-[10px]'}
`;

const StyledButtonContainer = tw.div`
    w-1/2
    h-[33px]
    flex
    items-center
    m-0
    p-0
    bg-white
    border-[1px]
    border-[#F1F2F3]
    border-solid
    box-border
    [&_svg]:cursor-pointer
    justify-center
`;

export const SlideMenu = ({ label, value, onNavigate, leftDisabled, rightDisabled, className }: SliderMenuSettings) => (
    <StyledMenuSelector className={className}>
        <Text>{label}</Text>
        <StyledButtonContainer>
            <ChevronLeft20Regular primaryFill={leftDisabled ? '#333' : '#304FF3'} onClick={onNavigate(false)} />
            <StyledYear>{value}</StyledYear>
            <ChevronRight20Regular primaryFill={rightDisabled ? '#333' : '#304FF3'} onClick={onNavigate(true)} />
        </StyledButtonContainer>
    </StyledMenuSelector>
);
