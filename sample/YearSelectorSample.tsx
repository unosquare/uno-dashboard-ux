import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useFilterStore from '../src/useFilterStore';
import { useViewStore } from '../src/useViewStore';
import HorizontalSelector from '../src/HorizontalSelector';

const thisYear = new Date().getFullYear();

export default () => {
    const [year, nextYear, previousYear] = useFilterStore(
        useShallow((state) => [state.month.Year, state.nextYear, state.previousYear]),
    );
    const [leftDisabled, disableLeft] = React.useState(false);
    const [rightDisabled, disableRight] = React.useState(year <= 2019);
    const toggleMenu = useViewStore((state) => state.toggleMenu);

    useEffect(() => {
        disableLeft(year <= 2019);
        disableRight(year === thisYear);
    }, [year]);

    const handleYear = (forward: boolean) => {
        if ((!forward && leftDisabled) || (forward && rightDisabled)) return;
        if (forward) {
            nextYear();
        } else {
            previousYear();
        }
        toggleMenu();
    };

    return (
        <HorizontalSelector label='Year' onValueChange={handleYear}>
            {year}
        </HorizontalSelector>
    );
};