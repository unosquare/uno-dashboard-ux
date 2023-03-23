export interface ReactSelectOption<T = number> {
    value: T;
    label: string;
}

export interface ReactSelectGroupOption {
    label: string;
    options: ReactSelectOption[];
}

const defaultFontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';

export const selectStyles = {
    container: (styles: any) => ({
        ...styles,
        minWidth: '200px',
        width: '90%',
        margin: '10px 15px 10px 0',
        justifyContent: 'end',
        fontSize: '12px',
        fontFamily: defaultFontFamily,
    }),
    control: (styles: any) => ({
        ...styles,
        width: '100%',
        marginLeft: 'auto',
        backgroundColor: 'white',
        fontSize: '12px',
        fontFamily: defaultFontFamily,
    }),
    option: (styles: any, { isDisabled }: any) => ({
        ...styles,
        color: 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
        fontSize: '12px',
        fontFamily: defaultFontFamily,
        ':active': {
            ...styles[':active'],
        },
    }),
};
