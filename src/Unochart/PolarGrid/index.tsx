import type React from 'react';

interface PolarGridProps {
    cx?: number;
    cy?: number;
    radius?: number;
    radialLines?: number;
    concentricCircles?: number;
    stroke?: string;
}

const PolarGrid: React.FC<PolarGridProps> = ({
    radius = 100,
    radialLines = 8,
    concentricCircles = 4,
    stroke = '#ccc',
}) => {
    const radialAngles = Array.from(
        { length: radialLines }, 
        (_, i) => (360 / radialLines) * i
    );
    
    const radiusSteps = Array.from(
        { length: concentricCircles }, 
        (_, i) => (radius / concentricCircles) * (i + 1)
    );

    return (
        <g className="polar-grid">
            {/* Radial lines */}
            {radialAngles.map((angle, index) => (
                <line
                    key={`line-${index}`}
                    x1={0}
                    y1={0}
                    x2={Math.cos((Math.PI / 180) * angle) * radius}
                    y2={Math.sin((Math.PI / 180) * angle) * radius}
                    stroke={stroke}
                    className="transition-all duration-300 ease-in-out"
                />
            ))}
            {/* Concentric circles */}
            {radiusSteps.map((r, index) => (
                <circle
                    key={`circle-${index}`}
                    cx={0}
                    cy={0}
                    r={r}
                    fill="none"
                    stroke={stroke}
                    className="transition-all duration-300 ease-in-out"
                />
            ))}
        </g>
    );
};

export default PolarGrid;
