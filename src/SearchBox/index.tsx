import { Search12Regular } from '@fluentui/react-icons';
import { TextInput } from '@tremor/react';
import React, { useEffect, useRef } from 'react';
import { useDebounce } from '../hooks';

export type SearchBoxSettings = {
    placeholder?: string;
    search: (value: string) => void;
    focus?: boolean;
    disabled?: boolean;
    initialValue?: string;
};

export const SearchBox = ({
    search,
    placeholder = 'Search',
    focus = false,
    disabled = false,
    initialValue = '',
}: SearchBoxSettings) => {
    const [value, setValue] = React.useState(initialValue);
    const ref = useRef<HTMLInputElement>(null);
    const debounceCall = useDebounce(() => search(value));

    useEffect(() => {
        if (focus && ref.current) setTimeout(() => ref.current?.focus(), 2000);
    }, [focus]);

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setValue(target.value);
        debounceCall();
    };

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
