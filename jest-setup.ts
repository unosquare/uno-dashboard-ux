import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

Object.assign(global, { TextEncoder });

beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));
});

afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
});
