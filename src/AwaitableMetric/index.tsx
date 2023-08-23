import React from 'react';
import { Metric } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import { HasChildrenComponent } from '../constants';

export type MetricSettings = {
    loading: boolean;
    className?: string;
};

export const AwaitableMetric = ({ loading = false, className, children }: HasChildrenComponent & MetricSettings) =>
    loading ? (
        <Metric className={twMerge(className, 'loading-shimmer')}>&nbsp;</Metric>
    ) : (
        <Metric className={className}>{children}</Metric>
    );
