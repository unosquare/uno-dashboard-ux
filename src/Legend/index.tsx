import React, { useEffect, useCallback } from 'react';
import { v4 as uuidv4, v4 } from 'uuid';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames, makeClassName, themeColorRange } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeLegendClassName = makeClassName('Legend');

const ChevronLeftFill = ({ ...props }) => (
    <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
        <title>Left</title>
        <path d='M8 12L14 6V18L8 12Z' />
    </svg>
);

const ChevronRightFill = ({ ...props }) => (
    <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'>
        <title>Right</title>
        <path d='M16 12L10 18V6L16 12Z' />
    </svg>
);

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

export interface ScrollButtonProps {
    icon: React.ElementType;
    onClick?: () => void;
    disabled?: boolean;
}

const ScrollButton = ({ icon, onClick, disabled }: ScrollButtonProps) => {
    const Icon = icon;
    const [isPressed, setIsPressed] = React.useState(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (isPressed) {
            intervalRef.current = setInterval(() => {
                onClick?.();
            }, 300);
        } else {
            clearInterval(intervalRef.current as NodeJS.Timeout);
        }
        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [isPressed, onClick]);

    useEffect(() => {
        if (disabled) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsPressed(false);
        }
    }, [disabled]);

    return (
        <button
            type='button'
            className={unoTwMerge(
                makeLegendClassName('legendSliderButton'),
                // common
                'w-5 group inline-flex items-center truncate rounded-unodashboard-small transition',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                // light
                disabled
                    ? 'text-unodashboard-content-subtle'
                    : 'text-unodashboard-content hover:text-unodashboard-content-emphasis hover:bg-unodashboard-background-subtle',
                // dark
                disabled
                    ? 'dark:text-dark-unodashboard-subtle'
                    : 'dark:text-dark-unodashboard dark:hover:text-unodashboard-content-emphasis dark:hover:bg-dark-unodashboard-background-subtle',
            )}
            disabled={disabled}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                setIsPressed(true);
            }}
            onMouseUp={(e) => {
                e.stopPropagation();
                setIsPressed(false);
            }}
        >
            <Icon className={'w-full'} />
        </button>
    );
};

export interface LegendProps extends React.OlHTMLAttributes<HTMLOListElement> {
    categories: string[];
    colors?: (Color | string)[];
    onClickLegendItem?: (category: string, color: Color | string) => void;
    activeLegend?: string;
    enableLegendSlider?: boolean;
}

type HasScrollProps = {
    left: boolean;
    right: boolean;
};

export const Legend = React.forwardRef<HTMLOListElement, LegendProps>((props, ref) => {
    const {
        categories,
        colors = themeColorRange,
        className,
        onClickLegendItem,
        activeLegend,
        enableLegendSlider = false,
        ...other
    } = props;
    const scrollableRef = React.useRef<HTMLInputElement>(null);
    const scrollButtonsRef = React.useRef<HTMLDivElement>(null);

    const [hasScroll, setHasScroll] = React.useState<HasScrollProps | null>(null);
    const [isKeyDowned, setIsKeyDowned] = React.useState<string | null>(null);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const checkScroll = useCallback(() => {
        const scrollable = scrollableRef?.current;
        if (!scrollable) return;

        const hasLeftScroll = scrollable.scrollLeft > 0;
        const hasRightScroll = scrollable.scrollWidth - scrollable.clientWidth > scrollable.scrollLeft;

        setHasScroll({ left: hasLeftScroll, right: hasRightScroll });
    }, [setHasScroll]); // dependencies are listed here in the array

    const scrollToTest = useCallback(
        (direction: 'left' | 'right') => {
            const element = scrollableRef?.current;
            const scrollButtons = scrollButtonsRef?.current;
            const width = element?.clientWidth ?? 0;
            const scrollButtonsWith = scrollButtons?.clientWidth ?? 0;

            if (element && enableLegendSlider) {
                element.scrollTo({
                    left:
                        direction === 'left'
                            ? element.scrollLeft - width + scrollButtonsWith
                            : element.scrollLeft + width - scrollButtonsWith,
                    behavior: 'smooth',
                });
                setTimeout(() => {
                    checkScroll();
                }, 400);
            }
        },
        [enableLegendSlider, checkScroll],
    );

    React.useEffect(() => {
        const keyDownHandler = (key: string) => {
            if (key === 'ArrowLeft') {
                scrollToTest('left');
            } else if (key === 'ArrowRight') {
                scrollToTest('right');
            }
        };
        if (isKeyDowned) {
            keyDownHandler(isKeyDowned);
            intervalRef.current = setInterval(() => {
                keyDownHandler(isKeyDowned);
            }, 300);
        } else {
            clearInterval(intervalRef.current as NodeJS.Timeout);
        }
        return () => clearInterval(intervalRef.current as NodeJS.Timeout);
    }, [isKeyDowned, scrollToTest]);

    const keyDown = (e: KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            setIsKeyDowned(e.key);
        }
    };
    const keyUp = (e: KeyboardEvent) => {
        e.stopPropagation();
        setIsKeyDowned(null);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const scrollable = scrollableRef?.current;
        if (enableLegendSlider) {
            checkScroll();

            scrollable?.addEventListener('keydown', keyDown);
            scrollable?.addEventListener('keyup', keyUp);
        }

        return () => {
            scrollable?.removeEventListener('keydown', keyDown);
            scrollable?.removeEventListener('keyup', keyUp);
        };
    }, [checkScroll, enableLegendSlider]);

    return (
        <ol
            ref={ref}
            className={unoTwMerge(makeLegendClassName('root'), 'relative overflow-hidden', className)}
            {...other}
        >
            <div
                ref={scrollableRef}
                className={unoTwMerge(
                    //common
                    'h-full flex',
                    enableLegendSlider
                        ? hasScroll?.right || hasScroll?.left
                            ? 'pl-4 pr-12  items-center overflow-auto snap-mandatory [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'
                            : ''
                        : 'flex-wrap',
                )}
            >
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
            {enableLegendSlider && (hasScroll?.right || hasScroll?.left) ? (
                <div
                    className={unoTwMerge(
                        // light mode
                        'bg-unodashboard-background',
                        // dark mode
                        'dark:bg-dark-unodashboard-background',
                        // common
                        'absolute flex top-0 pr-1 bottom-0 right-0 items-center justify-center h-full',
                    )}
                    ref={scrollButtonsRef}
                >
                    <ScrollButton
                        icon={ChevronLeftFill}
                        onClick={() => {
                            setIsKeyDowned(null);
                            scrollToTest('left');
                        }}
                        disabled={!hasScroll?.left}
                    />
                    <ScrollButton
                        icon={ChevronRightFill}
                        onClick={() => {
                            setIsKeyDowned(null);
                            scrollToTest('right');
                        }}
                        disabled={!hasScroll?.right}
                    />
                </div>
            ) : null}
        </ol>
    );
});
