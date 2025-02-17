import { type Color, colorValues } from './colors';
import { tremorTwMerge } from './tremorTwMerge';

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

export const makeClassName = (componentName: string) => (className: string) => `tremor-${componentName}-${className}`;

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
    BaseColors.Fuchsia,
    BaseColors.Slate,
    BaseColors.Gray,
    BaseColors.Zinc,
    BaseColors.Neutral,
    BaseColors.Stone,
    BaseColors.Red,
    BaseColors.Orange,
    BaseColors.Amber,
    BaseColors.Yellow,
    BaseColors.Lime,
    BaseColors.Green,
    BaseColors.Emerald,
    BaseColors.Teal,
    BaseColors.Pink,
    BaseColors.Rose,
];

export const getSelectButtonColors = (hasSelection: boolean, isDisabled: boolean, hasError = false) =>
    tremorTwMerge(
        isDisabled
            ? 'bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle'
            : 'bg-tremor-background dark:bg-dark-tremor-background',
        !isDisabled && 'hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted',
        hasSelection
            ? 'text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis'
            : 'text-tremor-content dark:text-dark-tremor-content',
        isDisabled && 'text-tremor-content-subtle dark:text-dark-tremor-content-subtle',
        hasError && 'text-red-500 placeholder:text-red-500 dark:text-red-500 dark:placeholder:text-red-500',
        hasError ? 'border-red-500 dark:border-red-500' : 'border-tremor-border dark:border-dark-tremor-border',
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
                    : 'text-tremor-brand dark:text-dark-tremor-brand',
                bgColor: '',
                borderColor: '',
                ringColor: '',
            };
        case 'light':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-tremor-brand dark:text-dark-tremor-brand',
                bgColor: color
                    ? tremorTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-tremor-brand-muted dark:bg-dark-tremor-brand-muted',
                borderColor: '',
                ringColor: '',
            };
        case 'shadow-sm':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-tremor-brand dark:text-dark-tremor-brand',
                bgColor: color
                    ? tremorTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-tremor-background dark:bg-dark-tremor-background',
                borderColor: 'border-tremor-border dark:border-dark-tremor-border',
                ringColor: '',
            };
        case 'solid':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-tremor-brand-inverted dark:text-dark-tremor-brand-inverted',
                bgColor: color
                    ? tremorTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-tremor-brand dark:bg-dark-tremor-brand',
                borderColor: 'border-tremor-brand-inverted dark:border-dark-tremor-brand-inverted',
                ringColor: 'ring-tremor-ring dark:ring-dark-tremor-ring',
            };
        case 'outlined':
            return {
                textColor: color
                    ? getColorClassNames(color, colorPalette.text).textColor
                    : 'text-tremor-brand dark:text-dark-tremor-brand',
                bgColor: color
                    ? tremorTwMerge(getColorClassNames(color, colorPalette.background).bgColor, 'bg-opacity-20')
                    : 'bg-tremor-background dark:bg-dark-tremor-background',
                borderColor: color
                    ? getColorClassNames(color, colorPalette.ring).borderColor
                    : 'border-tremor-brand-subtle dark:border-dark-tremor-brand-subtle',
                ringColor: color
                    ? tremorTwMerge(getColorClassNames(color, colorPalette.ring).ringColor, 'ring-opacity-40')
                    : 'ring-tremor-brand-muted dark:ring-dark-tremor-brand-muted',
            };
    }
};
