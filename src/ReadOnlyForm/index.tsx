import React from 'react';
import { Text } from '@tremor/react';
import { ReadOnlyFormSettings } from '../constants';
import { StyledFieldGroup, StyledFormContainer } from '../styled';

export const ReadOnlyForm = ({ initialData, columns = 3 }: ReadOnlyFormSettings<string | number>) => (
    <StyledFormContainer fields={initialData.length} columns={columns}>
        {initialData.map((item) => (
            <StyledFieldGroup key={item.label} $directionRow={false}>
                <Text>{item.label}</Text>
                <Text className='font-semibold mt-2'>{item.value}</Text>
            </StyledFieldGroup>
        ))}
    </StyledFormContainer>
);
