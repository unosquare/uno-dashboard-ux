import tw from 'tailwind-styled-components';
import type { FieldGroupSettings, FormContainerSettings } from './Form/formSettings';

const getGridCols = (columns: number) => {
    switch (columns) {
        case 2:
            return 'grid-cols-2';
        case 3:
            return 'grid-cols-3';
        case 4:
            return 'grid-cols-4';
        case 5:
            return 'grid-cols-5';
        case 6:
            return 'grid-cols-6';
        case 7:
            return 'grid-cols-7';
        case 8:
            return 'grid-cols-8';
        case 9:
            return 'grid-cols-9';
        case 10:
            return 'grid-cols-10';
        default:
            return 'grid-cols-1';
    }
};

const getGridRows = (rows: number) => {
    switch (rows) {
        case 2:
            return 'grid-rows-2';
        case 3:
            return 'grid-rows-3';
        case 4:
            return 'grid-rows-4';
        case 5:
            return 'grid-rows-5';
        case 6:
            return 'grid-rows-6';
        case 7:
            return 'grid-rows-7';
        case 8:
            return 'grid-rows-8';
        case 9:
            return 'grid-rows-9';
        case 10:
            return 'grid-rows-10';
        default:
            return 'grid-rows-1';
    }
};

export const StyledFormContainer = tw.div<FormContainerSettings>`
    grid
    ${({ columns }) => getGridCols(columns)}
    ${({ fields, columns }) => getGridRows(Math.trunc(fields / columns))}
    grid-flow-col
    gap-x-20
    gap-y-4
    w-full
    max-h-[100vh]
    py-5
    xl:py-[10px]
    lg:gap-y-[10px]
    lg:text-sm
    lg:py-[2px]
    xl:leading-[1.5]
    ${({ fields }) => fields % 2 !== 0 && 'pb-1'}
`;

export const StyledFieldGroup = tw.div<FieldGroupSettings>`
    flex
    w-full
    flex-col
    justify-center
    [&>div]:w-full
    ${({ $directionRow }) =>
        $directionRow &&
        `
            flex-row
            items-center
            justify-start
            pt-3
        `}
`;
