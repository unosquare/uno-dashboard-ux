import React from 'react';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';

export interface ButtonSettings {
    width?: string;
    fitContent?: boolean;
    ignoreFocus?: boolean;
}

export interface ButtonBaseSettings extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const ActionButtonContainer = tw.div`
    flex 
    items-center 
    h-full
    justify-end
`;

export const ActionButton = styled.button<ButtonSettings>`
    ${({ width }) => (width ? `width: ${width}` : 'width: 130px')};
    ${({ fitContent }) => fitContent && 'min-width: max-content'};
    display: inline-flex;
    margin-right: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    line-height: 1.5;
    color: #374151;
    border-width: 0px;
    background-color: transparent;
    height: 32px;
    font-size: 13px;
    svg {
        margin-right: 0.5rem;
    }
    ${({ ignoreFocus }) =>
        !ignoreFocus &&
        `
    :hover {
        background-color: rgba(229, 231, 235, 1);
    }
    :focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
    }
  `}
    :disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const StyledButton = tw.button`
    flex
    items-center
    justify-center
    h-[38px]
    rounded
    border-solid
    border-unoblue
    text-unoblue
    font-semibold
    hover:bg-unoblue
    hover:text-white
    cursor-pointer
    mx-auto
    min-w-[160px]
    font-sans
    bg-white
    py-0
    px-4
    pb-[2px]
    border-[1px] 
    text-xs
    box-border
`;

export const Button = ({ children, ...rest }: ButtonBaseSettings) => (
    <StyledButton type='button' {...rest}>
        {children}
    </StyledButton>
);
