import React, { useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { ChevronDown24Regular, ChevronUp24Regular } from '@fluentui/react-icons';
import { CardLoading } from '../CardLoading';

export interface DropdownSettings {
    options: any;
    value: any;
    label: string;
    extraBottom?: boolean;
    onOptionClicked: (value: any) => void;
    className?: string;
}

interface ContainerSettings {
    $extraBottom?: boolean;
}

export const StyledMenuSelector = tw.div<ContainerSettings>`
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

export const StyledTitle = tw.span`
    text-center
    w-1/2
    font-medium
`;

export const StyledButtonContainer = tw.div`
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

const StyledDropdownContainer = tw(StyledButtonContainer)`
    [&>svg]:mr-1
    relative
`;

const BaseItem = tw.div`
    flex
    justify-center
    items-center
    leading-[18px]
`;

const StyledDropdownSelected = tw(BaseItem)`
    bg-white
    w-full
    h-full
    flex
    items-center
    justify-center
    m-0
    p-[5px]
    cursor-pointer
    font-medium
    box-border
`;

const StyledDropDownList = tw.div`
    bg-white
    w-full
    h-full
    m-0
    p-0
    cursor-pointer
    z-50
    left-0
    top-9
    max-h-[250px]
    overflow-y-auto
    scrollbar
    shadow-lg
    rounded-b-sm
    box-border
    relative
`;

const StyledListItem = tw(BaseItem)`
    bg-white
    min-h-[32px]
    text-center
    font-medium
    m-0
    pl-[5px]
    pr-6
    hover:bg-unolightgray
    flex
    justify-centert
    items-center
    leading-[18px]
`;

const StyledListContainer = tw.div`
    absolute
    top-0
    w-full
`;

export const DropdownMenu = ({ options, value, label, onOptionClicked, extraBottom, className }: DropdownSettings) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggling = () => setIsOpen(!isOpen);

    const catMenu = useRef<any>(null);

    const closeOpenMenus = (e: any) => {
        if (catMenu.current && isOpen && !catMenu?.current?.contains(e.target)) setIsOpen(false);
    };

    document.addEventListener('mousedown', closeOpenMenus);

    const onSelect = (event: any) => () => {
        onOptionClicked(event);
        setIsOpen(false);
    };

    if (!options) return <CardLoading />;

    return (
        <StyledMenuSelector $extraBottom={extraBottom} className={className}>
            <StyledTitle>{label}</StyledTitle>
            <StyledDropdownContainer onClick={toggling} ref={catMenu}>
                <StyledDropdownSelected>{options[value]}</StyledDropdownSelected>
                {isOpen ? (
                    <>
                        <StyledListContainer>
                            <StyledDropDownList>
                                {Object.keys(options)
                                    .filter((key) => key !== value)
                                    .map((countryUrl) => (
                                        <StyledListItem key={countryUrl} onClick={onSelect(countryUrl)}>
                                            {options[countryUrl]}
                                        </StyledListItem>
                                    ))}
                            </StyledDropDownList>
                        </StyledListContainer>
                        <ChevronUp24Regular primaryFill='#304FF3' />
                    </>
                ) : (
                    <ChevronDown24Regular primaryFill='#304FF3' />
                )}
            </StyledDropdownContainer>
        </StyledMenuSelector>
    );
};
