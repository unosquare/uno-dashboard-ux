import React from 'react';
import tw from 'tailwind-styled-components';
import burger from '../resources/burger.svg';

export interface SubSectionSettings {
    disabled?: boolean;
}

export interface BurgerSettings {
    onClick: () => void;
}

export const MenuContainer = tw.div`
    absolute
    top-0
    right-0
    bg-white
    min-w-[350px]
    max-w-[350px]
    z-40
    flex
    pb-14
    flex-col
    animated-menu
`;

export const MenuSection = tw.div`
    flex
    justify-between
    cursor-pointer
    text-maingray
    mt-[18px]
    px-6
    [&_h6]:font-medium
    [&_h6]:m-0
    [&_h6]:text-lg
    [&_h6]:leading-6
`;

export const MenuSubSection = tw.div<SubSectionSettings>`
    flex
    flex-col
    py-0
    px-6
    cursor-pointer
    text-maingray
    [&_span]:text-sm
    [&_span]:leading-6
    [&_span]:mb-[5px]
    [&_span]:pl-[10px]
    [&_span]:hover:bg-unolightgray
    ${({ disabled }) =>
        disabled &&
        `
        cursor-default
        text-[#00000080]
    `}
`;

const StyledBurger = tw.img`
    w-[30px]
    h-[35px]
    cursor-pointer
`;

export const Burger = ({ onClick }: BurgerSettings) => (
    <StyledBurger src={burger} onClick={onClick} alt='Menu Icon' aria-hidden='true' />
);
