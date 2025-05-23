import React, { type ReactElement, type ReactNode } from "react";
import PolarGrid from "../PolarGrid";
import Pie from "../Pie";

interface PieChartProps {
    width: number;
    height: number;
    children: ReactNode;
    margin?: { top: number, right: number, left: number, bottom: number };
}

const PieChart: React.FC<PieChartProps> = ({ width, height, children }) => {
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    const chartRadius = maxRadius * 0.8; // 80% of max radius

    const processedChildren = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        const childProps: { [key: string]: any } = {};

        if (child.type === PolarGrid) {
            childProps.radius = chartRadius;
        }

        // Update Pie component props if needed
        if ((child as ReactElement).type === Pie) {
            const pieProps = (child as ReactElement).props;
            if (typeof pieProps.outerRadius === 'string' && pieProps.outerRadius.endsWith('%')) {
                const percentage = parseInt(pieProps.outerRadius) / 100;
                childProps.outerRadius = chartRadius * percentage;
            }
        }

        return React.cloneElement(child as ReactElement, childProps);
    });

    return (
        <svg
            width={width}
            height={height}
            className="bg-white"
            viewBox={`0 0 ${width} ${height}`}
        >
            <g transform={`translate(${cx}, ${cy})`}>
                {processedChildren}
            </g>
        </svg>
    );
};

export default PieChart;
