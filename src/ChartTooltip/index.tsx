import { v4 as uuidv4 } from 'uuid';
import type { Color } from '../constants';
import { BaseColors, colorPalette, getColorClassNames, type ValueFormatter } from '../theme';
import { unoTwMerge } from '../unoTwMerge';

export const ChartTooltipFrame = ({ children }: { children: React.ReactNode }) => (
    <div
        className={unoTwMerge(
            // common
            'rounded-unodashboard-default text-unodashboard-default border',
            // light
            'bg-unodashboard-background shadow-unodashboard-dropdown border-unodashboard-border',
            // dark
            'dark:bg-dark-unodashboard-background dark:shadow-dark-unodashboard-dropdown dark:border-dark-unodashboard-border',
        )}
    >
        {children}
    </div>
);

export interface ChartTooltipRowProps {
    value: string;
    name: string;
    color: Color | string;
}

export const ChartTooltipRow = ({ value, name, color }: ChartTooltipRowProps) => (
    <div className='flex items-center justify-between space-x-8'>
        <div className='flex items-center space-x-2'>
            <span
                className={unoTwMerge(
                    // common
                    'shrink-0 rounded-unodashboard-full border-2 h-3 w-3',
                    // light
                    'border-unodashboard-background shadow-unodashboard-card',
                    // dark
                    'dark:border-dark-unodashboard-background dark:shadow-dark-unodashboard-card',
                    getColorClassNames(color, colorPalette.background).bgColor,
                )}
            />
            <p
                className={unoTwMerge(
                    // commmon
                    'text-right whitespace-nowrap',
                    // light
                    'text-unodashboard-content',
                    // dark
                    'dark:text-dark-unodashboard-content',
                )}
            >
                {name}
            </p>
        </div>
        <p
            className={unoTwMerge(
                // common
                'font-medium tabular-nums text-right whitespace-nowrap',
                // light
                'text-unodashboard-content-emphasis',
                // dark
                'dark:text-dark-unodashboard-content-emphasis',
            )}
        >
            {value}
        </p>
    </div>
);

export interface ChartTooltipProps {
    active: boolean | undefined;
    payload: any[];
    label: string;
    categoryColors: Map<string, Color | string>;
    valueFormatter: ValueFormatter;
}

export const ChartTooltip = ({ active, payload, label, categoryColors, valueFormatter }: ChartTooltipProps) => {
    if (active && payload) {
        const filteredPayload = payload.filter((item: any) => item.type !== 'none');

        return (
            <ChartTooltipFrame>
                <div
                    className={unoTwMerge(
                        // light
                        'border-unodashboard-border border-b px-4 py-2',
                        // dark
                        'dark:border-dark-unodashboard-border',
                    )}
                >
                    <p
                        className={unoTwMerge(
                            // common
                            'font-medium',
                            // light
                            'text-unodashboard-content-emphasis',
                            // dark
                            'dark:text-dark-unodashboard-content-emphasis',
                        )}
                    >
                        {label}
                    </p>
                </div>

                <div className={unoTwMerge('px-4 py-2 space-y-1')}>
                    {filteredPayload.map(({ value, name }: { value: number; name: string }) => (
                        <ChartTooltipRow
                            key={uuidv4()}
                            value={valueFormatter(value)}
                            name={name}
                            color={categoryColors.get(name) ?? BaseColors.Blue}
                        />
                    ))}
                </div>
            </ChartTooltipFrame>
        );
    }
    return null;
};
