import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { HorizontalSelector } from '../src';

const thisYear = new Date().getFullYear();

export default () => {
    const [year, setYear] = useState(thisYear);
    const [leftDisabled, disableLeft] = React.useState(false);
    const [rightDisabled, disableRight] = React.useState(year <= 2019);

    useEffect(() => {
        disableLeft(year <= 2019);
        disableRight(year === thisYear);
    }, [year]);

    const handleYear = (forward: boolean) => {
        if ((!forward && leftDisabled) || (forward && rightDisabled)) return;
        setYear((prevYear) => (forward ? prevYear + 1 : prevYear - 1));
    };

    return (
        <HorizontalSelector label='Year' onValueChange={handleYear}>
            {year}
        </HorizontalSelector>
    );
};
