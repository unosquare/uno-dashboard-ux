import React from 'react';
import tw from 'tailwind-styled-components';
import loadingGif from '../resources/loading.gif';

const StyledLoading = tw.img`
    w-40 
    m-auto 
    block
`;

export const CardLoading = ({ img }: any) => <StyledLoading src={img || loadingGif} alt='Loading' />;
