import tw from 'tailwind-styled-components';

export type FooterSettings = {
    transparent?: boolean;
    copyright?: string;
};

const StyledFooter = tw.footer<FooterSettings>`
    w-full
    h-6
    p-2
    text-center
    ${({ transparent }) => (transparent ? 'bg-transparent' : 'bg-black')}
    ${({ transparent }) => (transparent ? 'text-black' : 'text-white')}
    text-xs
    fixed
    bottom-0
    z-30
    box-content
`;

export const Footer = ({ transparent, copyright = 'Copyright © Unosquare, LLC' }: FooterSettings) => (
    <StyledFooter transparent={transparent}>
        <span>{copyright}</span>
    </StyledFooter>
);
