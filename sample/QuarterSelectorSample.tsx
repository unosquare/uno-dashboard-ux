import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useFilterStore from '../src/useFilterStore';
import { useViewStore } from '../src/useViewStore';
import HorizontalSelector from '../src/HorizontalSelector';

export default () => {
    const [nextQuarter, previousQuarter] = useFilterStore(
        useShallow((state) => [state.nextQuarter, state.previousQuarter]),
    );

    const month = useFilterStore((state) => state.month);
    const year = month.Year;
    const quarter = month.YearQuarter;
    const [leftDisabled, setLeftDisabled] = useState(year <= 2019 && quarter.Quarter <= 1);
    const [rightDisabled, setRightDisabled] = useState(quarter.IsCurrent);
    const toggleMenu = useViewStore((state) => state.toggleMenu);

    useEffect(() => {
        const newLeftDisabled = year <= 2019 && quarter.Quarter <= 1;
        const newRightDisabled = quarter.IsCurrent;

        if (newLeftDisabled !== leftDisabled) setLeftDisabled(newLeftDisabled);

        if (newRightDisabled !== rightDisabled) setRightDisabled(newRightDisabled);
    }, [year, quarter, leftDisabled, rightDisabled]);

    const handleQuarter = (forward: boolean) => {
        if ((!forward && leftDisabled) || (forward && rightDisabled)) return;
        if (forward) nextQuarter();
        else previousQuarter();
        toggleMenu();
    };

    return (
        <HorizontalSelector label='Quarter' onValueChange={handleQuarter}>
            Q{quarter.Quarter}
        </HorizontalSelector>
    );
};