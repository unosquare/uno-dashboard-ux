import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'uno-js';

export const useDebounce = (callback: any) => {
    const ref = useRef<any>();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    return useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 700);
    }, []);
};

export const useToggle = (defaultValue = false): [boolean, () => void] => {
    const [getField, setField] = useState(defaultValue);

    const toggleField = (): void => setField(!getField);

    return [getField, toggleField];
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
