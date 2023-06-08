/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './sample/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
        './src/**/**/*.{js,ts,jsx,tsx}',
        './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    ],
    media: false, // or 'media' or 'class'
    theme: {
        transparent: 'transparent',
        current: 'currentColor',
        extend: {
            colors: {
                unoblue: '#304FF3',
                unolightgray: '#F1F2F3',
                inputGray: '#F5F5F5',
                unogray: '#808080',
                maingray: '#333',
                // light mode
                tremor: {
                    brand: {
                        faint: '#eff6ff', // blue-50
                        muted: '#bfdbfe', // blue-200
                        subtle: '#60a5fa', // blue-400
                        DEFAULT: '#3b82f6', // blue-500
                        emphasis: '#1d4ed8', // blue-700
                        inverted: '#ffffff', // white
                    },
                    background: {
                        muted: '#f9fafb', // gray-50
                        subtle: '#f3f4f6', // gray-100
                        DEFAULT: '#ffffff', // white
                        emphasis: '#374151', // gray-700
                    },
                    border: {
                        DEFAULT: '#e5e7eb', // gray-200
                    },
                    ring: {
                        DEFAULT: '#e5e7eb', // gray-200
                    },
                    content: {
                        subtle: '#9ca3af', // gray-400
                        DEFAULT: '#6b7280', // gray-500
                        emphasis: '#374151', // gray-700
                        strong: '#111827', // gray-900
                        inverted: '#ffffff', // white
                    },
                },
                // dark mode
                'dark-tremor': {
                    brand: {
                        faint: '#eff6ff', // blue-50
                        muted: '#bfdbfe', // blue-200
                        subtle: '#60a5fa', // blue-400
                        DEFAULT: '#3b82f6', // blue-500
                        emphasis: '#1d4ed8', // blue-700
                        inverted: '#ffffff', // white
                    },
                    background: {
                        muted: '#f9fafb', // gray-50
                        subtle: '#f3f4f6', // gray-100
                        DEFAULT: '#ffffff', // white
                        emphasis: '#374151', // gray-700
                    },
                    border: {
                        DEFAULT: '#e5e7eb', // gray-200
                    },
                    ring: {
                        DEFAULT: '#e5e7eb', // gray-200
                    },
                    content: {
                        subtle: '#9ca3af', // gray-400
                        DEFAULT: '#6b7280', // gray-500
                        emphasis: '#374151', // gray-700
                        strong: '#111827', // gray-900
                        inverted: '#ffffff', // white
                    },
                },
            },
            backgroundColor: {
                blackOpacity: 'rgba(0, 0, 0, 0.5)',
            },
            borderColor: {
                unogray: '#D3D3D3',
            },
            boxShadow: {
                card: 'rgb(255,255,255) 0px 0px 0px 0px, rgb(229,231, 235) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 1px 3px 0px, rgba(0,0,0,0.1) 0px 1px 2px -1px',
                alert: '0px 1px 7px 2px rgba(0, 0, 0, 0.5)',
                legend: '0 0px 2px 0px rgba(0, 0, 0, 0.5)',
                // light
                'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                // dark
                'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'dark-tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'dark-tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            borderRadius: {
                'tremor-small': '0.375rem',
                'tremor-default': '0.5rem',
                'tremor-full': '9999px',
            },
            fontSize: {
                'tremor-label': ['0.75rem'],
                'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
                'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
                'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
            },
            fontFamily: {
                sans: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            },
            screens: {
                xxs: { max: '375px' },
                xs: { max: '480px' },
                sm: { max: '768px' },
                md: { max: '1024px' },
                lg: { max: '1280px' },
                xl: { max: '1366px' },
            },
            maxWidth: {
                unomax: '1460px',
            },
        },
    },
    variants: {
        extend: {},
    },
    safelist: [
        {
            pattern:
                /bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover', 'ui-selected'],
        },
        {
            pattern:
                /ring-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern:
                /stroke-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
        },
        {
            pattern:
                /fill-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
        },
    ],
    plugins: [require('@headlessui/tailwindcss')],
};
