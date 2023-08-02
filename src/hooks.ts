import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'uno-js';

export const useDebounce = (callback: any) => {
    const ref = useRef<any>();

    useEffect(() => {
        ref.current = callback;
    }, [callback]);

    const debouncedCallback = useMemo(() => {
        const func = () => {
            ref.current?.();
        };

        return debounce(func, 700);
    }, []);

    return debouncedCallback;
};
