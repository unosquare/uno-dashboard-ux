import * as React from 'react';
import { Flex } from '../Flex';
import { Text, Title } from '../TextElements';

export const ErrorImage = (props: React.ComponentPropsWithRef<'svg'>) => (
    <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' {...props}>
        <title>Error</title>
        <defs>
            <path id='a' d='M0 0h386v189.5H0z' />
            <path
                id='c'
                fillRule='evenodd'
                d='m232.84 83.64 2.41 2.41-.31.31-2.41-2.41-2.41 2.41-.31-.31 2.41-2.41-2.41-2.41.31-.31 2.41 2.41 2.41-2.41.31.31-2.41 2.41z'
            />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h386v189.5H0z' />
                <use xlinkHref='#a' fill='#fff' />
            </mask>
        </defs>
        <use xlinkHref='#a' fill='none' />
        <g mask='url(#b)'>
            <path
                fill='none'
                stroke='#505050'
                strokeDasharray='0 0 0 0'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M312.09 188c7.72-16.73 12.03-35.36 12.03-55 0-72.63-58.87-131.5-131.5-131.5S61.12 60.37 61.12 133c0 19.64 4.31 38.27 12.03 55h238.94z'
            />
            <g fill='#505050'>
                <path fillRule='evenodd' d='M123.81 152.956h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M132.281 144.845h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M132.281 136.554h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path
                    fillRule='evenodd'
                    d='M132.281 127.903h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85zM140.572 144.845h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z'
                />
                <path fillRule='evenodd' d='M140.572 136.554h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M140.572 127.903h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M140.572 119.973h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path
                    fillRule='evenodd'
                    d='M148.862 119.973h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85zM191.397 111.322h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z'
                />
                <path fillRule='evenodd' d='M199.688 111.322h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path
                    fillRule='evenodd'
                    d='M199.688 119.613h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85zM222.037 167.554h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85zM180.223 161.066h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z'
                />
                <path fillRule='evenodd' d='M180.223 169.357h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path
                    fillRule='evenodd'
                    d='M180.223 177.647h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85zM207.618 78.159h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85zM223.839 78.159h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z'
                />
                <path fillRule='evenodd' d='M215.909 69.868h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M215.909 60.852h5.41v-5.41h-5.41v5.41zm3.96-1.44h-2.52v-2.52h2.52v2.52z' />
                <rect width={2.52} height={2.52} x={215.909} y={53.64} rx={0} ry={0} />
                <path fillRule='evenodd' d='M191.397 103.031h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M199.688 103.031h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M199.328 94.74h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M207.618 94.74h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z' />
                <path fillRule='evenodd' d='M199.328 86.45h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85V85z' />
                <path
                    fillRule='evenodd'
                    d='M207.618 86.45h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85V85zM132.281 152.956h9.73v-9.73h-9.73v9.73zm8.29-1.45h-6.85v-6.85h6.85v6.85z'
                />
                <path
                    fillRule='evenodd'
                    d='M215.542 177.639h-10.45l-.36-32.8h-37.89l-.72 15.5h-8.26v16.22h-9.01v-24.87h8.29v-6.85h-8.29v-26.32h9.01v1.44h-7.57v23.43h8.29v9.73h-8.29v21.99h6.13v-16.22h8.32l.72-15.5h40.69l.36 32.8h7.58v-43.61h7.93v-39.29h25.96v-6.85h-7.21v-8.29h-16.94v-8.29h-6.85v24.87h-7.57v16.94h-68.13v-1.44h66.69v-16.94h7.57v-24.87h9.73v8.29h16.94v8.29h7.21v9.73h-25.95v39.29h-7.93v43.62z'
                />
                <path
                    fillRule='evenodd'
                    d='M230.327 159.982h11.18v-27.4h-19.47v10.1h8.29v17.3zm9.73-1.44h-8.29v-17.31h-8.29v-7.21h16.58v24.52z'
                />
            </g>
            <use xlinkHref='#c' fill='#505050' />
            <use xlinkHref='#c' fillOpacity={0} stroke='#505050' strokeDasharray='0 0 0 0' strokeWidth={1.3} />
            <path
                fill='none'
                stroke='#505050'
                strokeDasharray='0 0 0 0'
                strokeLinecap='square'
                strokeLinejoin='bevel'
                strokeWidth={3}
                d='M1.5 188h29M37.5 188h29M319.5 188h29M355.5 188h29'
            />
        </g>
    </svg>
);

export class ErrorBoundary extends React.Component<React.PropsWithChildren, { errorInfo: React.ErrorInfo | null }> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = {
            errorInfo: null,
        };
    }

    public componentDidCatch(_error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            errorInfo,
        });
    }

    public render() {
        const { errorInfo } = this.state;
        const { children } = this.props;

        if (errorInfo) {
            return (
                <Flex alignItems='center' flexDirection='col' justifyContent='center' className='mt-6'>
                    <ErrorImage width={386} height={189.5} />
                    <Title>Oops, something went wrong</Title>
                    <Text className='font-medium'>Please refresh the page and try again</Text>
                </Flex>
            );
        }

        return children;
    }
}
