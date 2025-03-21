import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Color } from '../constants';
import { colorPalette, getColorClassNames, makeClassName, themeColorRange } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

const makeCategoryBarClassName = makeClassName('CategoryBar');

const getMarkerBgColor = (markerValue: number | undefined, values: number[], colors: Color[]): string => {
    if (markerValue === undefined) return '';

    let prefixSum = 0;
    for (let i = 0; i < values.length; i++) {
        const currentWidthPercentage = values[i];
        const currentBgColor = getColorClassNames(colors[i], colorPalette.background).bgColor;

        prefixSum += currentWidthPercentage;
        if (prefixSum >= markerValue) return currentBgColor;
    }

    return '';
};

const getPositionLeft = (value: number | undefined, maxValue: number): number => (value ? (value / maxValue) * 100 : 0);

const sumNumericArray = (arr: number[]) => arr.reduce((prefixSum, num) => prefixSum + num, 0);

const BarLabels = ({ values }: { values: number[] }) => {
    const sumValues = useMemo(() => sumNumericArray(values), [values]);
    let prefixSum = 0;
    let sumConsecutiveHiddenLabels = 0;
    return (
        <div
            className={unoTwMerge(
                makeCategoryBarClassName('labels'),
                // common
                'relative flex w-full text-unodashboard-default h-5 mb-2',
                // light
                'text-unodashboard-content',
                // dark
                'dark:text-dark-unodashboard-content',
            )}
        >
            {values.slice(0, values.length).map((widthPercentage) => {
                prefixSum += widthPercentage;
                const showLabel =
                    (widthPercentage >= 0.1 * sumValues || sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
                    sumValues - prefixSum >= 0.15 * sumValues &&
                    prefixSum >= 0.1 * sumValues;
                sumConsecutiveHiddenLabels = showLabel
                    ? 0
                    : // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                      (sumConsecutiveHiddenLabels += widthPercentage);

                const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

                return (
                    <div
                        key={uuidv4()}
                        className='flex items-center justify-end'
                        style={{ width: `${widthPositionLeft}%` }}
                    >
                        <span className={unoTwMerge(showLabel ? 'block' : 'hidden', 'left-1/2 translate-x-1/2')}>
                            {prefixSum}
                        </span>
                    </div>
                );
            })}
            <div className={unoTwMerge('absolute bottom-0 flex items-center left-0')}>0</div>
            <div className={unoTwMerge('absolute bottom-0 flex items-center right-0')}>{sumValues}</div>
        </div>
    );
};

export interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
    values: number[];
    colors?: Color[];
    markerValue?: number;
    showLabels?: boolean;
    showAnimation?: boolean;
}

export const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>((props, ref) => {
    const {
        values = [],
        colors = themeColorRange,
        markerValue,
        showLabels = true,
        showAnimation = false,
        className,
        ...other
    } = props;

    const markerBgColor = useMemo(() => getMarkerBgColor(markerValue, values, colors), [markerValue, values, colors]);

    const maxValue = useMemo(() => sumNumericArray(values), [values]);

    const markerPositionLeft: number = useMemo(() => getPositionLeft(markerValue, maxValue), [markerValue, maxValue]);

    return (
        <div ref={ref} className={unoTwMerge(makeCategoryBarClassName('root'), className)} {...other}>
            {showLabels ? <BarLabels values={values} /> : null}
            <div
                className={unoTwMerge(makeCategoryBarClassName('barWrapper'), 'relative w-full flex items-center h-2')}
            >
                <div
                    className={unoTwMerge(
                        // common
                        'flex-1 flex items-center h-full overflow-hidden rounded-unodashboard-full',
                    )}
                >
                    {values.map((value, idx) => (
                        <div
                            key={uuidv4()}
                            className={unoTwMerge(
                                makeCategoryBarClassName('categoryBar'),
                                'h-full',
                                getColorClassNames(colors[idx] ?? 'gray', colorPalette.background).bgColor,
                            )}
                            style={{ width: `${(value / maxValue) * 100}%` }}
                        />
                    ))}
                </div>
                {markerValue !== undefined ? (
                    <div
                        className={unoTwMerge(
                            makeCategoryBarClassName('markerWrapper'),
                            'absolute right-1/2 -translate-x-1/2 w-5',
                        )}
                        style={{
                            left: `${markerPositionLeft}%`,
                            transition: showAnimation ? 'all 1s' : '',
                        }}
                    >
                        <div
                            className={unoTwMerge(
                                makeCategoryBarClassName('marker'),
                                // common
                                'ring-2 mx-auto rounded-unodashboard-full h-4 w-1',
                                // light
                                'ring-unodashboard-brand-inverted',
                                // dark
                                'dark:ring-dark-unodashboard-brand-inverted',
                                markerBgColor,
                            )}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
});
