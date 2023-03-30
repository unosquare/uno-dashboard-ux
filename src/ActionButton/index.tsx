import styled from 'styled-components';

export interface ButtonSettings {
    width?: string;
    fitContent?: boolean;
    ignoreFocus?: boolean;
}

export const ActionButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
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
