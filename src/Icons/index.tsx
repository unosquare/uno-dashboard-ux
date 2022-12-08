import React from 'react';

export const DefaultImg = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' width={77.36} height={67.69} {...props}>
        <path
            fill='#505050'
            fillRule='evenodd'
            d='M4.83 4.84v14.5h72.52v4.83h-14.5v14.51h14.5v4.83h-14.5v14.51h14.5v4.83h-14.5v4.84h-4.84v-4.84H33.84v4.84H29v-4.84H4.83v4.84H0V0h77.36v4.84H4.83zm0 19.33v14.51H29V24.17H4.83zm53.19 0H33.85v14.51h24.17V24.17zM29.01 43.51v14.51H4.83V43.51h24.18zm4.84 0h24.17v14.51H33.85V43.51z'
        />
    </svg>
);

export const LinkIcon = (props: any) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width={15}
        height={9.315}
        {...props}
    >
        <defs>
            <title>Link</title>
            <path id='a' d='M0 0h15v9.315H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h15v9.315H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path
                fill='#304FF3'
                fillRule='evenodd'
                d='M8.313 6.26c-.4.174-.826.26-1.275.26h-.476v-.93c.375 0 .726-.038 1.063-.125s.638-.224.9-.41c.263-.186.462-.422.625-.72s.225-.659.225-1.068c0-.323-.063-.621-.188-.907a2.373 2.373 0 0 0-.5-.745 2.39 2.39 0 0 0-.75-.497 2.246 2.246 0 0 0-.9-.186h-3.75c-.325 0-.624.062-.912.186a2.39 2.39 0 0 0-.75.497c-.212.21-.375.46-.5.745a2.223 2.223 0 0 0-.188.907c0 .422.076.782.226 1.068.15.285.362.534.625.72.262.186.562.323.9.41a4.22 4.22 0 0 0 1.062.124v.932h-.462c-.45 0-.875-.087-1.275-.261-.4-.174-.75-.41-1.038-.696a3.382 3.382 0 0 1-.712-1.03A3.109 3.109 0 0 1 0 3.266C0 2.819.087 2.397.263 2A3.349 3.349 0 0 1 2 .26C2.4.088 2.825 0 3.288 0h3.75c.45 0 .875.087 1.274.26.4.175.75.41 1.038.696.288.286.525.634.7 1.031.175.398.262.82.262 1.267 0 .447-.087.87-.262 1.267A3.349 3.349 0 0 1 8.312 6.26zm2.937-2.534v-.931h.475c.45 0 .875.087 1.275.26a3.349 3.349 0 0 1 1.737 1.739c.176.398.263.82.263 1.267 0 .447-.087.87-.263 1.267a3.349 3.349 0 0 1-.7 1.03A3.373 3.373 0 0 1 13 9.055c-.4.174-.825.261-1.275.261h-3.75a3.18 3.18 0 0 1-1.287-.26c-.4-.174-.75-.41-1.038-.696a3.349 3.349 0 0 1-.7-1.031 3.067 3.067 0 0 1-.263-1.267c0-.46.088-.882.263-1.28A3.373 3.373 0 0 1 6.7 3.056c.4-.173.825-.26 1.275-.26h.463v.931a4.22 4.22 0 0 0-1.063.124 2.726 2.726 0 0 0-.9.423 2.048 2.048 0 0 0-.625.72c-.15.286-.225.646-.225 1.068 0 .31.063.634.188.907s.287.522.5.733c.212.21.462.372.75.496.287.125.587.187.912.187h3.75c.313 0 .637-.075.913-.199.275-.124.525-.286.737-.497a2.316 2.316 0 0 0 .688-1.64c0-.422-.063-.77-.226-1.067a2.065 2.065 0 0 0-.625-.72 2.704 2.704 0 0 0-.9-.41 4.22 4.22 0 0 0-1.062-.125z'
            />
        </g>
    </svg>
);

export const CheckIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width={12} height={12} {...props}>
        <title>Check</title>
        <defs>
            <path id='a' d='M0 0h12v12H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h12v12H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path
                fill='#304FF3'
                fillRule='evenodd'
                d='M12 12V0H0v12h12zM9.49 3.49l.52.52L4.5 9.53 1.99 7.01l.52-.52L4.5 8.47l4.99-4.98z'
            />
        </g>
    </svg>
);

export const UncheckIcon = (props: any) => (
    <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width={12} height={12} {...props}>
        <title>Uncheck</title>
        <defs>
            <path id='a' d='M0 0h12v12H0z' />
            <mask id='b' maskContentUnits='userSpaceOnUse' maskUnits='userSpaceOnUse'>
                <path d='M0 0h12v12H0z' />
                <use fill='#fff' xlinkHref='#a' />
            </mask>
        </defs>
        <use fill='none' xlinkHref='#a' />
        <g mask='url(#b)'>
            <path fill='#304FF3' fillRule='evenodd' d='M12 12V0H0v12h12zM.75.75h10.5v10.5H.75V.75z' />
        </g>
    </svg>
);
