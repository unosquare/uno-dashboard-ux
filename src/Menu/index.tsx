import React from 'react';
import tw from 'tailwind-styled-components';

export type SubSectionSettings = {
    disabled?: boolean;
};

export type BurgerSettings = {
    onClick: () => void;
};

export const StyledMenuActions = tw.div`
    flex
    justify-between
    py-5
    px-[25px]
    [&_svg]:cursor-pointer
`;

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
    p-4
`;

export const StyledMenuSearchBox = tw.div`
    m-0
    mr-auto
    ml-[58px]
    p-4
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

export const Burger = ({ onClick }: BurgerSettings) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width={30}
        height={17}
        onClick={onClick}
        cursor='pointer'
    >
        <defs>
            <path id='a' d='M0 0h30v16.886H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h30v16.886H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path fill='#FFF' fillRule='evenodd' d='M0 1.886V0h30v1.886H0zm0 7.5V7.5h30v1.886H0zM0 15v1.886h30V15H0z' />
        </g>
    </svg>
);
