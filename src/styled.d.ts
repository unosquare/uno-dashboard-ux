import 'styled-components';

interface ChartColors {
    [palette: string]: string[];
}

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            main: string;
            secondary: string;
            fontMain: string;
            fontSecondary: string;
            background: string;
            tableContent: string;
            blackOpacity: string;
            cardBackground: string;
            table: string;
            charts?: ChartColors;
        };
        maxWidth: string;
    }
}
