import { type Color, colorValues } from './colors';
import { unoTwMerge } from './unoTwMerge';

export type ValueFormatter = (value: number) => string;

const justifyContentValues = ['start', 'end', 'center', 'between', 'around', 'evenly'] as const;
export type JustifyContent = (typeof justifyContentValues)[number];

const alignItemsValues = ['start', 'end', 'center', 'baseline', 'stretch'] as const;
export type AlignItems = (typeof alignItemsValues)[number];

export type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';

interface ColorClassNames {
    bgColor: string;
    hoverBgColor: string;
    selectBgColor: string;
    textColor: string;
    selectTextColor: string;
    hoverTextColor: string;
    borderColor: string;
    selectBorderColor: string;
    hoverBorderColor: string;
    ringColor: string;
    strokeColor: string;
    fillColor: string;
}

export const colorPalette = {
    canvasBackground: 50,
    lightBackground: 100,
    background: 500,
    darkBackground: 600,
    darkestBackground: 800,
    lightBorder: 200,
    border: 500,
    darkBorder: 700,
    lightRing: 200,
    ring: 300,
    iconRing: 500,
    lightText: 400,
    text: 500,
    iconText: 600,
    darkText: 700,
    darkestText: 900,
    icon: 500,
};

const getIsArbitraryColor = (color: Color | string) =>
    color.includes('#') || color.includes('--') || color.includes('rgb');

const getIsBaseColor = (color: Color | string) => colorValues.includes(color as Color);

export function getColorClassNames(color: Color | string, shade?: number): ColorClassNames {
    const isBaseColor = getIsBaseColor(color);

    if (color === 'white' || color === 'black' || color === 'transparent' || !shade || !isBaseColor) {
        const unshadedColor = !getIsArbitraryColor(color) ? color : `[${color}]`;
        return {
            bgColor: `bg-${unshadedColor} dark:bg-${unshadedColor}`,
            hoverBgColor: `hover:bg-${unshadedColor} dark:hover:bg-${unshadedColor}`,
            selectBgColor: `data-[selected]:bg-${unshadedColor} dark:data-[selected]:bg-${unshadedColor}`,
            textColor: `text-${unshadedColor} dark:text-${unshadedColor}`,
            selectTextColor: `data-[selected]:text-${unshadedColor} dark:data-[selected]:text-${unshadedColor}`,
            hoverTextColor: `hover:text-${unshadedColor} dark:hover:text-${unshadedColor}`,
            borderColor: `border-${unshadedColor} dark:border-${unshadedColor}`,
            selectBorderColor: `data-[selected]:border-${unshadedColor} dark:data-[selected]:border-${unshadedColor}`,
            hoverBorderColor: `hover:border-${unshadedColor} dark:hover:border-${unshadedColor}`,
            ringColor: `ring-${unshadedColor} dark:ring-${unshadedColor}`,
            strokeColor: `stroke-${unshadedColor} dark:stroke-${unshadedColor}`,
            fillColor: `fill-${unshadedColor} dark:fill-${unshadedColor}`,
        };
    }

    return {
        bgColor: `bg-${color}-${shade} dark:bg-${color}-${shade}`,
        selectBgColor: `data-[selected]:bg-${color}-${shade} dark:data-[selected]:bg-${color}-${shade}`,
        hoverBgColor: `hover:bg-${color}-${shade} dark:hover:bg-${color}-${shade}`,
        textColor: `text-${color}-${shade} dark:text-${color}-${shade}`,
        selectTextColor: `data-[selected]:text-${color}-${shade} dark:data-[selected]:text-${color}-${shade}`,
        hoverTextColor: `hover:text-${color}-${shade} dark:hover:text-${color}-${shade}`,
        borderColor: `border-${color}-${shade} dark:border-${color}-${shade}`,
        selectBorderColor: `data-[selected]:border-${color}-${shade} dark:data-[selected]:border-${color}-${shade}`,
        hoverBorderColor: `hover:border-${color}-${shade} dark:hover:border-${color}-${shade}`,
        ringColor: `ring-${color}-${shade} dark:ring-${color}-${shade}`,
        strokeColor: `stroke-${color}-${shade} dark:stroke-${color}-${shade}`,
        fillColor: `fill-${color}-${shade} dark:fill-${color}-${shade}`,
    };
}

export const makeClassName = (componentName: string) => (className: string) =>
    `unodashboard-${componentName}-${className}`;

export const constructCategoryColors = (
    categories: string[],
    colors: (Color | string)[],
): Map<string, Color | string> => {
    const categoryColors = new Map<string, Color | string>();
    categories.forEach((category, idx) => {
        categoryColors.set(category, colors[idx % colors.length]);
    });
    return categoryColors;
};

export const BaseColors: { [key: string]: Color } = {
    Slate: 'slate',
    Gray: 'gray',
    Zinc: 'zinc',
    Neutral: 'neutral',
    Stone: 'stone',
    Red: 'red',
    Orange: 'orange',
    Amber: 'amber',
    Yellow: 'yellow',
    Lime: 'lime',
    Green: 'green',
    Emerald: 'emerald',
    Teal: 'teal',
    Cyan: 'cyan',
    Sky: 'sky',
    Blue: 'blue',
    Indigo: 'indigo',
    Violet: 'violet',
    Purple: 'purple',
    Fuchsia: 'fuchsia',
    Pink: 'pink',
    Rose: 'rose',
};

export const themeColorRange: Color[] = [
    BaseColors.Blue,
    BaseColors.Cyan,
    BaseColors.Sky,
    BaseColors.Indigo,
    BaseColors.Violet,
    BaseColors.Purple,
    BaseColors.Red,
    BaseColors.Orange,
    BaseColors.Amber,
    BaseColors.Yellow,
    BaseColors.Lime,
    BaseColors.Green,
    BaseColors.Emerald,
    BaseColors.Fuchsia,
    BaseColors.Pink,
    BaseColors.Rose,
    BaseColors.Teal,
    BaseColors.Slate,
    BaseColors.Gray,
    BaseColors.Zinc,
    BaseColors.Stone,
    BaseColors.Neutral,
];

export const getSelectButtonColors = (hasSelection: boolean, isDisabled: boolean, hasError = false) =>
    unoTwMerge(
        isDisabled
            ? 'bg-unodashboard-background-subtle dark:bg-dark-unodashboard-background-subtle'
            : 'bg-unodashboard-background dark:bg-dark-unodashboard-background',
        !isDisabled && 'hover:bg-unodashboard-background-muted dark:hover:bg-dark-unodashboard-background-muted',
        hasSelection
            ? 'text-unodashboard-content-emphasis dark:text-dark-unodashboard-content-emphasis'
            : 'text-unodashboard-content dark:text-dark-unodashboard-content',
        isDisabled && 'text-unodashboard-content-subtle dark:text-dark-unodashboard-content-subtle',
        hasError && 'text-red-500 placeholder:text-red-500 dark:text-red-500 dark:placeholder:text-red-500',
        hasError
            ? 'border-red-500 dark:border-red-500'
            : 'border-unodashboard-border dark:border-dark-unodashboard-border',
    );

export const hasValue = <T>(value: T | null | undefined) => value !== null && value !== undefined && value !== '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const iconVariantValues = ['simple', 'light', 'shadow-sm', 'solid', 'outlined'] as const;

export type IconVariant = (typeof iconVariantValues)[number];

export const getIconColors = (variant: IconVariant, color?: Color) => {
    switch (variant) {
        case 'simple':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-unodashboard-brand dark:text-dark-unodashboard-brand',
                bgColor: '',
                borderColor: '',
                ringColor: '',
            };
        case 'light':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-unodashboard-brand dark:text-dark-unodashboard-brand',
                bgColor: color
                    ? unoTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-unodashboard-brand-muted dark:bg-dark-unodashboard-brand-muted',
                borderColor: '',
                ringColor: '',
            };
        case 'shadow-sm':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-unodashboard-brand dark:text-dark-unodashboard-brand',
                bgColor: color
                    ? unoTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-unodashboard-background dark:bg-dark-unodashboard-background',
                borderColor: 'border-unodashboard-border dark:border-dark-unodashboard-border',
                ringColor: '',
            };
        case 'solid':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-unodashboard-brand-inverted dark:text-dark-unodashboard-brand-inverted',
                bgColor: color
                    ? unoTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-unodashboard-brand dark:bg-dark-unodashboard-brand',
                borderColor: 'border-unodashboard-brand-inverted dark:border-dark-unodashboard-brand-inverted',
                ringColor: 'ring-unodashboard-ring dark:ring-dark-unodashboard-ring',
            };
        case 'outlined':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-unodashboard-brand dark:text-dark-unodashboard-brand',
                bgColor: color
                    ? unoTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-unodashboard-background dark:bg-dark-unodashboard-background',
                borderColor: color
                    ? getColorClassNames(color, colorPalette.ring).borderColor
                    : 'border-unodashboard-brand-subtle dark:border-dark-unodashboard-brand-subtle',
                ringColor: color
                    ? unoTwMerge(getColorClassNames(color, colorPalette.ring).ringColor, 'ring-opacity-40')
                    : 'ring-unodashboard-brand-muted dark:ring-dark-unodashboard-brand-muted',
            };
    }
};
