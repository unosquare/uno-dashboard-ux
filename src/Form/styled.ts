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
    focus:outline-hidden
    text-unodashboard-content
    dark:text-dark-unodashboard-content
    bg-unodashboard-background
    dark:bg-dark-unodashboard-background
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
    file:rounded-l-unodashboard-small
    file:rounded-r-none
    file:border-0
    file:px-3
    file:py-1.5
    file:text-unodashboard-default
    file:outline-hidden
    file:border-solid
    file:border-unodashboard-border
    file:bg-unodashboard-background-muted
    file:text-unodashboard-content
    hover:file:bg-unodashboard-background-subtle/80
    dark:file:border-dark-unodashboard-border
    dark:file:bg-dark-unodashboard-background-muted
    dark:hover:file:bg-dark-unodashboard-background-subtle/30
    file:[border-inline-end-width:1px]
    file:[margin-inline-end:0.75rem]
    focus:outline-hidden
    disabled:pointer-events-none
    file:disabled:pointer-events-none
    file:disabled:bg-unodashboard-background-subtle
    file:disabled:text-unodashboard-content
    dark:file:disabled:border-gray-700
    dark:file:disabled:bg-dark-unodashboard-background-subtle
`;
