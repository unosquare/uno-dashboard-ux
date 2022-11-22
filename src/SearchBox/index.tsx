import React from 'react';
import styled from 'styled-components';

const SearchBoxLayout = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
`;

const SearchGlass = styled.svg`
    height: 1.25rem;
    width: 1.25rem;
    opacity: 0.75;
    position: absolute;
    top: 0.7rem;
    left: 0.5rem;
    color: #304ff3;
`;

const Input = styled.input`
    flex-grow: 1;
    border-width: 0px;
    border-bottom-width: 1.5px;
    display: block;
    height: 100%;
    width: 100%;
    margin-left: 0.5rem;
    padding-bottom: 0px;
    padding-top: 0.5rem;
    padding-left: 1.5rem;
    line-height: 1rem;
    font-weight: 500;
    line-height: 1.25;
    background-color: transparent;
    :focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
    }
`;

export const CrossContainer = styled.div`
    position: 'relative';
    height: '1.75rem';
`;

const CrossButton = styled.button<CrossButtonSettings>`
    border-width: 0px;
    cursor: pointer;
    align-self: center;
    right: -2rem;
    bottom: -0.5rem;
    position: absolute;
    background-color: transparent;
    :focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
    }
    visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const Cross = styled.svg`
    height: 1rem;
    width: 1rem;
    opacity: 0.75;
`;

export interface SearchBoxSettings {
    placeholder?: string;
    search: (value: string) => void;
}

interface CrossButtonSettings extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    visible?: boolean;
}

export const SearchBox = ({ search, placeholder = 'Search' }: SearchBoxSettings) => {
    const [value, setValue] = React.useState('');

    const onSearch = (val: string) => {
        setValue(val);
        search(val);
    };

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => onSearch(target.value);

    const onCrossPressed = () => onSearch('');

    return (
        <SearchBoxLayout>
            <SearchGlass
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                transform='rotate(90,0,0)'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
            </SearchGlass>
            <CrossContainer>
                <Input value={value} onChange={onChange} type='text' placeholder={placeholder} />
                <CrossButton visible={value !== ''} onClick={onCrossPressed}>
                    <Cross xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                        />
                    </Cross>
                </CrossButton>
            </CrossContainer>
        </SearchBoxLayout>
    );
};
