import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Blur } from './index';

export default {
    title: 'Blur',
    component: Blur,
} as Meta;

const Template: Story = (args) => <Blur {...args} />;

export const Default = Template.bind({});
Default.args = {};
