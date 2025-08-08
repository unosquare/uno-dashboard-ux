import React from 'react';
import { v4 } from 'uuid';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames, makeClassName, themeColorRange } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeLegendClassName = makeClassName('Legend');

export interface LegendItemProps {
    name: string;
    color: Color | string;
    onClick?: (name: string, color: Color | string) => void;
    activeLegend?: string;
}

const LegendItem = ({ name, color, onClick, activeLegend }: LegendItemProps) => {
    const hasOnValueChange = !!onClick;

    return (
        <li
            className={unoTwMerge(
                makeLegendClassName('legendItem'),
                // common
                'group inline-flex items-center px-2 py-0.5 rounded-unodashboard-small transition whitespace-nowrap',
                hasOnValueChange ? 'cursor-pointer' : 'cursor-default',
                // light
                'text-unodashboard-content',
                hasOnValueChange ? 'hover:bg-unodashboard-background-subtle' : '',
                // dark
                'dark:text-dark-unodashboard-content',
                hasOnValueChange ? 'dark:hover:bg-dark-unodashboard-background-subtle' : '',
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(name, color);
            }}
        >
            <svg
                className={unoTwMerge(
                    'flex-none h-2 w-2 mr-1.5',
                    getColorClassNames(color, colorPalette.text).textColor,
                    activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100',
                )}
                fill='currentColor'
                viewBox='0 0 8 8'
            >
                <title>OK</title>
                <circle cx={4} cy={4} r={4} />
            </svg>
            <p
                className={unoTwMerge(
                    // common
                    'whitespace-nowrap truncate text-unodashboard-default',
                    // light
                    'text-unodashboard-content',
                    hasOnValueChange ? 'group-hover:text-unodashboard-content-emphasis' : '',
                    // dark
                    'dark:text-dark-unodashboard-content',
                    activeLegend && activeLegend !== name ? 'opacity-40' : 'opacity-100',
                    hasOnValueChange ? 'dark:group-hover:text-dark-unodashboard-content-emphasis' : '',
                )}
            >
                {name}
            </p>
        </li>
    );
};

export interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
    categories: string[];
    colors?: (Color | string)[];
    onClickLegendItem?: (category: string, color: Color | string) => void;
    activeLegend?: string;
}

export const Legend = React.forwardRef<HTMLOListElement, LegendProps>(
    ({ categories, colors = themeColorRange, className, onClickLegendItem, activeLegend, ...other }, ref) => (
        <ol
            ref={ref}
            className={unoTwMerge(makeLegendClassName('root'), 'relative overflow-hidden', className)}
            {...other}
        >
            <div className={unoTwMerge('h-full flex flex-wrap')}>
                {categories.map((category, idx) => (
                    <LegendItem
                        key={v4()}
                        name={category}
                        color={colors[idx % colors.length]}
                        onClick={onClickLegendItem}
                        activeLegend={activeLegend}
                    />
                ))}
            </div>
        </ol>
    ),
);
