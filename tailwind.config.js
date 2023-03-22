/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/**/*.{js,ts,jsx,tsx}'],
    media: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                unoblue: '#304FF3',
                unolightgray: '#F1F2F3',
                inputGray: '#F5F5F5',
                unogray: '#808080',
                maingray: '#333',
            },
            textColor: {
                errorgray: '#707070',
                filtergray: '#505050',
            },
            backgroundColor: {
                unodarkblue: '#1B2E93',
                unoWarning: '#D7C600',
                blackOpacity: 'rgba(0, 0, 0, 0.5)',
            },
            borderColor: {
                unogray: '#D3D3D3',
            },
            boxShadow: {
                card: '0 1px 3px 0px rgba(0, 0, 0, 0.5)',
                alert: '0px 1px 7px 2px rgba(0, 0, 0, 0.5)',
                legend: '0 0px 2px 0px rgba(0, 0, 0, 0.5)',
            },
            fontFamily: {
                sans: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            },
            maxWidth: {
                unomax: '1460px',
            },
        },
        screens: {
            xxs: { max: '375px' },
            xs: { max: '480px' },
            sm: { max: '768px' },
            md: { max: '1024px' },
            lg: { max: '1280px' },
            xl: { max: '1366px' },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
