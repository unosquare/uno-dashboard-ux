import { DefaultTheme } from 'styled-components';

export const baseTheme: DefaultTheme = {
    colors: {
        main: '#304FF3',
        secondary: '#fff',
        fontMain: '#333',
        fontSecondary: '#fff',
        background: '#f1f2f3',
        cardBackground: '#fff',
        tableContent: '#808080',
        blackOpacity: 'rgba(0, 0, 0, 0.5)',
        table: '#808080',
    },
    maxWidth: '1460px',
};

const mediaSizes = {
    xxs: 375,
    xs: 480,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1366,
};

export const device = {
    smOnly: `@media (min-width: ${mediaSizes.xs + 1}px and ${mediaSizes.sm}px)`,
    xxs: `@media (max-width: ${mediaSizes.xxs}px)`,
    xs: `@media (max-width: ${mediaSizes.xs}px)`,
    sm: `@media (max-width: ${mediaSizes.sm}px)`,
    md: `@media (max-width: ${mediaSizes.md}px)`,
    lg: `@media (max-width: ${mediaSizes.lg}px)`,
    xl: `@media (max-width: ${mediaSizes.xl}px)`,
};

export const defaultChartPalette = ['#003DE6', '#ac00c9', '#ea00a1', '#ff0077', '#ff414f', '#ff792a', '#ffa600'];
