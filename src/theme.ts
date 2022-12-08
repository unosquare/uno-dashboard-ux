import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const baseTheme: DefaultTheme = {
    colors: {
        main: '#304FF3',
        secondary: '#fff',
        fontMain: '#333',
        fontSecondary: '#fff',
        background: '#f1f2f3',
        cardBackground: '#fff',
        footerBackground: '#191919',
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

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.colors.background};
    padding: 0px;
    margin: 0px;
    overflow: hidden !important;
  }
  #root {
    height: 100%;
    overflow: hidden !important;
  }
  h1, h2, h3, h4, h5, h6, span, p, a, strong, td, th, text, .__react_component_tooltip {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  td {
    padding: 0px 10px;
  }
  th {
    position: sticky;
    top: 0px;
    background: #fff;
  }
  .recharts-legend-item-text, .recharts-cartesian-axis-tick-value {
    font-size: 13px;
  }
  .recharts-legend-item {
    margin-right: 25px;
  }
`;
