import React from 'react';
import styled from 'styled-components';
import loadingGif from '../resources/loading.gif';

const StyledLoading = styled.img`
    width: 160px;
    margin: auto;
    display: block;
`;

export const Loading = ({ img }: any) => <StyledLoading src={img || loadingGif} alt='Loading' />;
