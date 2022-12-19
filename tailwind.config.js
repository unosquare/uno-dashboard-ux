module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/**/*.{js,ts,jsx,tsx}'],
    media: false, // or 'media' or 'class'
    theme: {
        extend: {
            textColor: {
                unoblue: '#304FF3',
                unogray: '#808080',
                noresultsred: '#F2545B',
                errorgray: '#707070',
                filtergray: '#505050',
                maingray: '#333',
            },
            backgroundColor: {
                unoblue: '#304FF3',
                unodarkblue: '#1B2E93',
                layoutheader: '#191919',
                unolightgray: '#F1F2F3',
                inputGray: '#F5F5F5',
                unoWarning: '#D7C600',
                blackOpacity: 'rgba(0, 0, 0, 0.5)',
            },
            borderColor: {
                unoblue: '#304FF3',
                unogray: '#D3D3D3',
            },
            boxShadow: {
                card: '0 1px 3px 0px rgba(0, 0, 0, 0.5)',
                alert: '0px 1px 7px 2px rgba(0, 0, 0, 0.5)',
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
