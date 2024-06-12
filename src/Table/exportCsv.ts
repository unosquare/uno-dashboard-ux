import { formatter, isMoneyObject, toPercentage } from 'uno-js';
import { DataTypes, FinancialMetric, TableCellTypes, TableColumn } from '../constants';
import { translateType } from '../utils';

const renderCellString = (cell: TableCellTypes, dataType?: DataTypes) => {
    const cellString = String(cell);
    if (cellString == null || cellString === ' ') return 'N/A';

    return formatter(cellString, translateType(dataType)) ?? cellString;
};

const renderMoneyString = (cell: TableCellTypes) => {
    if (!cell) return formatter(0, 'decimal') as string;
    return formatter(isMoneyObject(cell) ? cell.Amount : cell, 'decimal') as string;
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
                    if (cell instanceof Array && cell.length > 1) return String(cell[1]);
                    return String(cell);
                case 'financial':
                    return toPercentage((cell as FinancialMetric).GrossMargin) as string;
                default:
                    return renderCellString(cell, dataType);
            }
        }),
    );
