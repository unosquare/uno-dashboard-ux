import { constructCategoryColors } from '@tremor/react/dist/components/chart-elements/common/utils';
import { themeColorRange } from '@tremor/react/dist/lib/theme';
import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'uno-js';

export const useDebounce = (callback: () => unknown, waitMilliseconds?: number) => {
    const ref = useRef<() => unknown>(null);

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    return useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, waitMilliseconds ?? 700);
    }, [waitMilliseconds]);
};

export const useToggle = (defaultValue = false): [boolean, () => void] => {
    const [field, setField] = useState(defaultValue);

    const toggleField = (): void => setField(!field);

    return [field, toggleField];
};

export const useTheme = (): [string, () => void] => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light');

    useEffect(() => {
        const body = document.getElementById('body');
        if (!body) return;
        if (theme === 'dark') body.classList.add('dark');
        else body.classList.remove('dark');

        localStorage.setItem('theme', theme);
    }, [theme]);

    const updateTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return [theme, updateTheme];
};

export const useChart = <T>(
    rawData: T | undefined,
    dataCallback: ((data: T) => Record<string, unknown>[]) | undefined,
): [Record<string, unknown>[], Map<string, string>, string[]] => {
    const dataTransformFn = useMemo(
        () => dataCallback ?? ((data: T) => data as unknown as Record<string, unknown>[]),
        [dataCallback],
    );

    const [dataStore, setDataStore] = useState<Record<string, unknown>[]>([]);
    const [categoryColors, setCategoryColors] = useState<Map<string, string>>(new Map());
    const [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        startTransition(() => {
            if (!rawData) return;

            const data = dataTransformFn(rawData);
            const tempKeys = data.length > 0 ? Object.keys(data[0]).filter((property) => property !== 'name') : [];

            setDataStore(data);
            setKeys(tempKeys);
            setCategoryColors(constructCategoryColors(tempKeys, themeColorRange));
        });
    }, [rawData, dataTransformFn]);

    return [dataStore, categoryColors, keys];
};
