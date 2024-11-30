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

export const StyledFileInput = tw(InputBase)`
    text-sm
    rounded-lg
    file:-my-1.5
    file:-ml-2.5
    file:h-[34px]
    file:cursor-pointer
    file:rounded-l-tremor-small
    file:rounded-r-none
    file:border-0
    file:px-3
    file:py-1.5
    file:text-tremor-default
    file:outline-none
    file:border-solid
    file:border-tremor-border
    file:bg-tremor-background-muted
    file:text-tremor-content
    hover:file:bg-tremor-background-subtle/80
    file:dark:border-dark-tremor-border
    file:dark:bg-dark-tremor-background-muted
    hover:file:dark:bg-dark-tremor-background-subtle/30
    file:[border-inline-end-width:1px]
    file:[margin-inline-end:0.75rem]
    focus:outline-none
    disabled:pointer-events-none
    file:disabled:pointer-events-none
    file:disabled:bg-tremor-background-subtle
    file:disabled:text-tremor-content
    file:disabled:dark:border-gray-700
    file:disabled:dark:bg-dark-tremor-background-subtle
`;
