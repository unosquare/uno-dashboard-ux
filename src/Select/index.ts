export interface ReactSelectOption<T = number> {
    value: T;
    label: string;
}

export interface ReactSelectGroupOption {
    label: string;
    options: ReactSelectOption[];
}
