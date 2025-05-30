import { Dismiss24Regular, Search24Regular } from '@fluentui/react-icons';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { TextInput } from '../TextInput';
import { useDebounce } from '../hooks';

export type SearchBoxSettings = {
    placeholder?: string;
    search: (value: string) => void;
    focus?: boolean;
    disabled?: boolean;
    initialValue?: string;
};

export const SearchOrClearButton = ({ hasValue = false, onClick }: { hasValue: boolean; onClick: () => void }) =>
    hasValue ? <Dismiss24Regular className='cursor-pointer' onClick={() => onClick()} /> : <Search24Regular />;

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

    const setSearchValue = useCallback(
        (x = '') => {
            setValue(x);
            debounceCall();
        },
        [debounceCall],
    );

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearchValue(target.value);

    const icon = useMemo(
        () => () => <SearchOrClearButton hasValue={value.length > 0} onClick={setSearchValue} />,
        [value, setSearchValue],
    );

    return (
        <TextInput
            className='max-w-[220px] [&_input]:px-[10px] [&_svg]:ml-2'
            icon={icon}
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            type='text'
            placeholder={placeholder}
        />
    );
};
