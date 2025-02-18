import { extendTailwindMerge } from 'tailwind-merge';

export const unoTwMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            shadow: [
                {
                    shadow: [
                        {
                            unodashboard: ['input', 'card', 'dropdown'],
                            'dark-unodashboard': ['input', 'card', 'dropdown'],
                        },
                    ],
                },
            ],
            rounded: [
                {
                    rounded: [
                        {
                            unodashboard: ['small', 'default', 'full'],
                            'dark-unodashboard': ['small', 'default', 'full'],
                        },
                    ],
                },
            ],
            'font-size': [
                {
                    text: [
                        {
                            unodashboard: ['default', 'title', 'metric'],
                            'dark-unodashboard': ['default', 'title', 'metric'],
                        },
                    ],
                },
            ],
        },
    },
});
