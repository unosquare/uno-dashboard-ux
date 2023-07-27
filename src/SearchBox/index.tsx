import { Search12Regular } from '@fluentui/react-icons';
import { TextInput } from '@tremor/react';
import React, { useEffect, useRef } from 'react';

export interface SearchBoxSettings {
    placeholder?: string;
    search: (value: string) => void;
    focus?: boolean;
    disabled?: boolean;
}

export const SearchBox = ({ search, placeholder = 'Search', focus = false, disabled = false }: SearchBoxSettings) => {
    const [value, setValue] = React.useState('');
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (focus && ref.current) {
            setTimeout(() => ref.current?.focus(), 2000);
        }
    }, [focus]);

    const onSearch = (val: string) => {
        setValue(val);
        search(val);
    };

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => onSearch(target.value);

    return (
        <TextInput
            className='max-w-[220px]'
            icon={Search12Regular}
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            type='text'
            placeholder={placeholder}
        />
    );
};
