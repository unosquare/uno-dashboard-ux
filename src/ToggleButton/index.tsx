import { ToggleLeft16Regular, ToggleRight16Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';
import { ActionButton, ActionButtonContainer } from '../ActionButton';

interface ToggleButtonProps {
    leftLabel: string;
    rightLabel: string;
    onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ leftLabel, rightLabel, onClick }: ToggleButtonProps) => {
    const [isOn, setIsOn] = useState(false);

    const onToggle = () => {
        setIsOn((prev: boolean) => !prev);
        onClick();
    };

    return (
        <ActionButtonContainer>
            <ActionButton width='max-content' type='button' onClick={onToggle}>
                {isOn ? <ToggleRight16Regular primaryFill='#304FF3' /> : <ToggleLeft16Regular primaryFill='#304FF3' />}
                {isOn ? rightLabel : leftLabel}
            </ActionButton>
        </ActionButtonContainer>
    );
};

export default ToggleButton;
