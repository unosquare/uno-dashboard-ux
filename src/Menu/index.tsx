import tw from 'tailwind-styled-components';

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
    bg-unodashboard-background 
    dark:bg-dark-unodashboard-background
    min-w-[350px]
    max-w-[350px]
    z-40
    flex
    pb-14
    flex-col
    animated-slideInRight
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
    text-unodashboard-content 
    dark:text-dark-unodashboard-content
    mt-[18px]
    px-6
    [&_h6]:font-medium
    [&_h6]:m-0
    [&_h6]:text-lg
    [&_h6]:leading-6
`;

export const MenuSubSection = tw.div`
    flex
    flex-col
    py-0
    px-6
    cursor-pointer
    text-unodashboard-content 
    dark:text-dark-unodashboard-content
    [&_span]:text-sm
    [&_span]:leading-6
    [&_span]:mb-[5px]
    [&_span]:pl-[10px]
    hover:[&_span]:bg-unodashboard-emphasis
    dark:hover:[&_span]:bg-dark-unodashboard-emphasis
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
        <title>Burger Icon</title>
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
