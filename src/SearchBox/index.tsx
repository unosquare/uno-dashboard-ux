import React, { useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';

const SearchBoxLayout = tw.div`
    flex
    flex-row
    relative
`;

const SearchGlass = tw.svg`
    h-[1.25rem]
    w-[1.25rem]
    opacity-75
    absolute
    top-[0.7rem]
    left-[0.5rem]
    text-[#304ff3]
`;

const Input = tw.input`
    flex-grow
    border-0
    border-b-[1.5px]
    block
    h-full
    w-full
    ml-[0.5rem]
    pb-0
    pt-[0.5rem]
    pl-[1.5rem]
    leading-[1rem]
    bg-transparent
    text-sm
    focus:outline-[2px]
    focus:outline-offset-[2px]
    focus:outline-transparent
    focus:outline-solid
`;

export const CrossContainer = tw.div`
    relative
    h-[1.75rem]
`;

const CrossButton = tw.button<CrossButtonSettings>`
    border-0
    cursor-pointer
    align-self-center
    -right-[2rem]
    -bottom-[0.5rem]
    absolute
    bg-transparent
    focus:outline-[2px]
    focus:outline-offset-[2px]
    focus:outline-transparent
    focus:outline-solid
    ${({ $visible }) => ($visible ? 'visible' : 'invisible')};
`;

const Cross = tw.svg`
    h-[1rem]
    w-[1rem]
    opacity-75
`;

export interface SearchBoxSettings {
    placeholder?: string;
    search: (value: string) => void;
    focus?: boolean;
}

interface CrossButtonSettings extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    $visible: boolean;
}

export const SearchBox = ({ search, placeholder = 'Search', focus = false }: SearchBoxSettings) => {
    const [value, setValue] = React.useState('');
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (focus && ref.current) {
            setTimeout(() => ref.current?.focus(), 3000);
        }
    }, [focus]);

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
                <Input ref={ref} value={value} onChange={onChange} type='text' placeholder={placeholder} />
                <CrossButton $visible={value !== ''} onClick={onCrossPressed}>
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
