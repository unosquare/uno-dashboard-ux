export type ReactSelectOption<T = number> = {
    value: T;
    label: string;
};

export type ReactSelectGroupOption = {
    label: string;
    options: ReactSelectOption[];
};

const defaultFontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';

export const selectStyles = {
    container: (styles: Record<string, unknown>) => ({
        ...styles,
        minWidth: '200px',
        width: '90%',
        margin: '10px 15px 10px 0',
        justifyContent: 'end',
        fontSize: '12px',
        fontFamily: defaultFontFamily,
    }),
    control: (styles: Record<string, unknown>) => ({
        ...styles,
        width: '100%',
        marginLeft: 'auto',
        backgroundColor: 'white',
        fontSize: '12px',
        fontFamily: defaultFontFamily,
    }),
    option: (styles: Record<string, unknown>, { isDisabled }: Record<string, unknown>) => ({
        ...styles,
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
        fontSize: '12px',
        fontFamily: defaultFontFamily,
        ':active': {
            ...(typeof styles[':active'] === 'object' && styles[':active']),
        },
    }),
};
