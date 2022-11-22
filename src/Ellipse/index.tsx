import React from 'react';

export interface EllipseSettings {
    color: string;
    small?: boolean;
}

export const Ellipse = ({ color, small }: EllipseSettings) => (
    <svg height={small ? '15' : '20'} width={small ? '15' : '20'}>
        <ellipse cx={small ? '7.5' : '10'} cy={small ? '8' : '10'} rx='5' ry='5' style={{ fill: color }} />
    </svg>
);
