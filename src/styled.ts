import tw from 'tailwind-styled-components';
import { FieldGroupSettings, FormContainerSettings } from './Form/formSettings';

export const StyledFormContainer = tw.div<FormContainerSettings>`
    grid
    ${({ columns }) => `grid-cols-${columns}`}
    ${({ fields, columns }) => `grid-rows-${(fields / columns).toFixed()}`}
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
