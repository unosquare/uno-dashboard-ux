import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TooltipProps {
    tooltipData?: {
        name: string;
        values: { key: string; value: number | [number, number]; color: string }[];
    } | null;
    position?: { x: number; y: number };
}

export default function Tooltip({ tooltipData = null, position = { x: 0, y: 0 } }: TooltipProps) {
    if (!tooltipData) return null;

    return (
        <div
            className='absolute bg-white p-2.5 shadow-md rounded-md border border-gray-200 transform -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-300 ease-in-out'
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}
            role='tooltip'
        >
            <h3 className='font-semibold text-gray-800 mb-2 text-sm text-center border-b border-gray-200 pb-1'>
                {tooltipData.name}
            </h3>
            <ul className='space-y-1.5'>
                {tooltipData.values.map((value) => (
                    <li key={uuidv4()} className='flex justify-between items-center text-xs'>
                        <span className='font-medium' style={{ color: value.color }}>
                            {value.key}:
                        </span>
                        <span className='font-bold ml-1'>
                            {Array.isArray(value.value)
                                ? `${value.value[0]} - ${value.value[1]}`
                                : value.value !== undefined && value.value !== null
                                  ? value.value.toLocaleString()
                                  : 'N/A'}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
