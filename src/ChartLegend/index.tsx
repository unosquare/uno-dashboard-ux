import { useRef } from 'react';
import { Legend } from '../Legend';
import type { Color } from '../constants';
import { useOnWindowResize } from '../hooks';

export const ChartLegend = (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    { payload }: any,
    categoryColors: Map<string, Color | string>,
    setLegendHeight: React.Dispatch<React.SetStateAction<number>>,
    activeLegend: string | undefined,
    onClick?: (category: string, color: Color | string) => void,
    enableLegendSlider?: boolean,
) => {
    const legendRef = useRef<HTMLDivElement>(null);

    useOnWindowResize(() => {
        const calculateHeight = (height: number | undefined) =>
            height
                ? Number(height) + 20 // 20px extra padding
                : 60; // default height
        setLegendHeight(calculateHeight(legendRef.current?.clientHeight));
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const filteredPayload = payload.filter((item: any) => item.type !== 'none');

    return (
        <div ref={legendRef} className='flex items-center justify-end'>
            <Legend
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                categories={filteredPayload.map((entry: any) => entry.value)}
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                colors={filteredPayload.map((entry: any) => categoryColors.get(entry.value))}
                onClickLegendItem={onClick}
                activeLegend={activeLegend}
                enableLegendSlider={enableLegendSlider}
            />
        </div>
    );
};
