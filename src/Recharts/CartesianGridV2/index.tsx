import type React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CartesianGridProps {
    width?: number;
    height?: number;
    strokeDasharray?: string;
    maxValue?: number;
    minValue?: number;
    layout?: 'horizontal' | 'vertical';
}

const CartesianGridV2: React.FC<CartesianGridProps> = ({
    width = 0,
    height = 0,
    strokeDasharray = '3 3',
    maxValue = 0,
    minValue = 0,
    layout = 'horizontal',
}) => {
    const numLines = minValue < 0 ? 11 : 6;

    return (
        <g className='cartesian-grid'>
            {/* Vertical grid lines */}
            {new Array(11).fill(null).map((_, index) => (
                <line
                    key={uuidv4()}
                    x1={(index * width) / 10}
                    y1='0'
                    x2={(index * width) / 10}
                    y2={height}
                    stroke='grey'
                    strokeWidth={1}
                    strokeDasharray='4 4'
                    className='transition-all duration-300 ease-in-out'
                />
            ))}

            {/* Horizontal grid lines */}
            {layout === 'horizontal'
                ? new Array(numLines)
                      .fill(null)
                      .map((_, index) => (
                          <line
                              key={uuidv4()}
                              x1='0'
                              y1={(index * height) / (numLines - 1)}
                              x2={width}
                              y2={(index * height) / (numLines - 1)}
                              stroke='grey'
                              strokeWidth={1}
                              strokeDasharray='4 4'
                              className='transition-all duration-300 ease-in-out'
                          />
                      ))
                : new Array(numLines)
                      .fill(null)
                      .map((_, index) => (
                          <line
                              key={uuidv4()}
                              x1={(index * width) / (numLines - 1)}
                              y1='0'
                              x2={(index * width) / (numLines - 1)}
                              y2={height}
                              stroke='grey'
                              strokeWidth={1}
                              strokeDasharray='4 4'
                              className='transition-all duration-300 ease-in-out'
                          />
                      ))}
        </g>
    );
};

export default CartesianGridV2;
