import react, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface PieProps {
    data: Array<{ name: string; value: number }>;
    dataKey: keyof { name: string; value: number };
    nameKey: string;
    cx?: string | number;
    cy?: string | number;
    innerRadius?: number;
    outerRadius: number;
    fill: string;
    label?: 'percent' | 'numbers' | string[];
    startAngle?: number;
    endAngle?: number;
    paddingAngle?: number;
    activeShape?: boolean;
}

const Pie: React.FC<PieProps> = ({
    data,
    dataKey,
    nameKey,
    innerRadius = 0,
    outerRadius,
    fill,
    label,
    startAngle = 0,
    endAngle = 360,
    paddingAngle = 0,
    activeShape = false,
}) => {
    const totalValue = data.reduce((acc, item) => acc + (item[dataKey] as number), 0);
    const angleRange = endAngle - startAngle;
    let currentAngle = startAngle + 180;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <g>
            {data.map((entry, index) => {
                const value = entry[dataKey] as number;
                const angle = (value / totalValue) * angleRange - paddingAngle;
                const nextAngle = currentAngle + angle;
                const largeArcFlag = angle > 180 ? 1 : 0;

                const outerX = Math.cos((Math.PI / 180) * nextAngle) * outerRadius;
                const outerY = Math.sin((Math.PI / 180) * nextAngle) * outerRadius;
                const innerX = Math.cos((Math.PI / 180) * nextAngle) * innerRadius;
                const innerY = Math.sin((Math.PI / 180) * nextAngle) * innerRadius;

                const pathData = `
                    M ${Math.cos((Math.PI / 180) * currentAngle) * innerRadius} ${Math.sin((Math.PI / 180) * currentAngle) * innerRadius}
                    L ${Math.cos((Math.PI / 180) * currentAngle) * outerRadius} ${Math.sin((Math.PI / 180) * currentAngle) * outerRadius}
                    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerX} ${outerY}
                    L ${innerX} ${innerY}
                    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${Math.cos((Math.PI / 180) * currentAngle) * innerRadius} ${Math.sin((Math.PI / 180) * currentAngle) * innerRadius}
                    Z
                `;

                currentAngle = nextAngle + paddingAngle;

                let labelText = '';
                if (label === 'percent') {
                    labelText = `${((value / totalValue) * 100).toFixed(1)}%`;
                } else if (label === 'numbers') {
                    labelText = `${value}`;
                } else if (Array.isArray(label) && label[index]) {
                    labelText = label[index];
                }

                const isActive = activeShape && activeIndex === index;
                const adjustedOuterRadius = isActive ? outerRadius + 10 : outerRadius;

                return (
                    <g
                        key={uuidv4()}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        className="transition-transform duration-300 ease-in-out"
                    >
                        <path
                            d={pathData}
                            fill={fill}
                            stroke="white"
                            strokeWidth={2}
                            className={`transition-all duration-300 ease-in-out ${isActive ? 'filter drop-shadow-lg' : ''}`}
                            style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
                        />
                        {labelText && (
                            <text
                                x={Math.cos((Math.PI / 180) * (currentAngle - angle / 2)) * (adjustedOuterRadius + 10)}
                                y={Math.sin((Math.PI / 180) * (currentAngle - angle / 2)) * (adjustedOuterRadius + 10)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={fill}
                                className="text-xs font-semibold transition-all duration-300 ease-in-out"
                                style={{ fontSize: isActive ? '12px' : '10px' }}
                            >
                                {labelText}
                            </text>
                        )}
                    </g>
                );
            })}
        </g>
    );
};

export default Pie;

