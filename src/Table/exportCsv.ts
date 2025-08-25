import { formatter, isMoneyObject, toPercentage } from 'uno-js';
import type { DataTypes, FinancialMetric, TableCellTypes, TableColumn, Tenure } from '../constants';
import { translateType } from '../utils';

const zeroString = '0.00';

const renderDateString = (cell: Date | string) => {
    const date = cell instanceof Date ? cell : new Date(cell);

    if (Number.isNaN(date.getTime())) {
        return 'N/A';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const renderCellString = (cell: TableCellTypes, dataType?: DataTypes) => {
    const cellString = String(cell);
    if (cellString == null || cellString === ' ') return 'N/A';

    if (dataType === 'date') return renderDateString(cell as Date | string);

    return formatter(cellString, translateType(dataType)) ?? cellString;
};

const renderMoneyString = (cell: TableCellTypes) => {
    if (!cell) return zeroString;

    if (isMoneyObject(cell)) return cell.Amount === 0 ? zeroString : (formatter(cell.Amount, 'money') as string);

    return formatter(cell, 'decimal') as string;
};

export const renderToRowString = (data: TableCellTypes[][], definitions: TableColumn[]) =>
    data.map((row) =>
        row.map((cell, index) => {
            const { dataType } = definitions[index];

            switch (dataType) {
                case 'money':
                    return renderMoneyString(cell);
                case 'boolean':
                    return cell ? 'TRUE' : 'FALSE';
                case 'list':
                    return (cell as string[]).join(', ');
                case 'link':
                    if (Array.isArray(cell) && cell.length > 1) return String(cell[1]);
                    return String(cell);
                case 'financial':
                    return toPercentage((cell as FinancialMetric).GrossMargin) as string;
                case 'tenure': {
                    const tenureData = cell as Tenure;
                    return formatter(tenureData.Months, 'months') as string;
                }
                default:
                    return renderCellString(cell, dataType);
            }
        }),
    );
