import tw from 'tailwind-styled-components';
const InputBase = tw.input`
    py-[7px]
    px-2
    my-1
    w-full
    rounded
    border-gray-300
    border
    hover:bg-gray-200
    focus:bg-gray-200
    disabled:text-[#999999]
    focus:outline-none
    text-tremor-content 
    dark:text-dark-tremor-content
    bg-tremor-background 
    dark:bg-dark-tremor-background
    text-xs
`;

export const StyledCheckbox = tw(InputBase)`
    w-7
    h-[33px]
    accent-blue-500
    mr-4
    ml-3
`;
