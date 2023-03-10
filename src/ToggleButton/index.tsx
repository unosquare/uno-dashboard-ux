import { ToggleLeft16Regular, ToggleRight16Regular } from '@fluentui/react-icons';
import React from 'react';
import { ActionButton, ActionButtonContainer } from '../ActionButton';

export interface ToggleButtonProps {
    value?: boolean;
    leftLabel: string;
    rightLabel: string;
    onClick: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
    value,
    leftLabel,
    rightLabel,
    onClick,
}: ToggleButtonProps) => (
    <ActionButtonContainer>
        <ActionButton width='max-content' type='button' onClick={onClick}>
            {value ? <ToggleRight16Regular primaryFill='#304FF3' /> : <ToggleLeft16Regular primaryFill='#304FF3' />}
            {value ? rightLabel : leftLabel}
        </ActionButton>
    </ActionButtonContainer>
);

export default ToggleButton;
