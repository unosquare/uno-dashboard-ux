import styled from 'styled-components';

export const Divider = styled.div`
    height: 80%;
    border-left: ${({ theme }) => theme.colors.background} 2px solid;
    margin-left: 20px;
    margin-right: 20px;
`;
