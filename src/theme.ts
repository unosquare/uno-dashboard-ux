import { colorValues, type Color } from './constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const justifyContentValues = ["start", "end", "center", "between", "around", "evenly"] as const;
export type JustifyContent = (typeof justifyContentValues)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const alignItemsValues = ["start", "end", "center", "baseline", "stretch"] as const;
export type AlignItems = (typeof alignItemsValues)[number];

export type FlexDirection = "row" | "col" | "row-reverse" | "col-reverse";

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

export function makeClassName(componentName: string) {
    return (className: string) => {
        return `tremor-${componentName}-${className}`;
    };
}
