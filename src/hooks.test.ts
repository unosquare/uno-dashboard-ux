import { act, renderHook } from '@testing-library/react';
import { useDebounce, useTheme, useToggle } from './hooks';

describe('useToggle', () => {
    it('should toggle the boolean value', () => {
        const { result } = renderHook(() => useToggle(false));
        expect(result.current[0]).toBe(false);

        act(() => {
            result.current[1]();
        });

        expect(result.current[0]).toBe(true);

        act(() => {
            result.current[1]();
        });

        expect(result.current[0]).toBe(false);
    });
});

describe('useDebounce', () => {
    it('should debounce the callback', () => {
        jest.useFakeTimers();

        const callback = jest.fn();
        const { result } = renderHook(() => useDebounce(callback, 1000));

        act(() => {
            result.current();
        });

        expect(callback).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(callback).toHaveBeenCalled();
    });
});

describe('useTheme', () => {
    it('should toggle the theme', () => {
        const { result } = renderHook(() => useTheme());
        expect(result.current[0]).toBe('light');

        act(() => {
            result.current[1]();
        });

        expect(result.current[0]).toBe('dark');

        act(() => {
            result.current[1]();
        });

        expect(result.current[0]).toBe('light');
    });
});
