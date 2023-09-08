import React, { PropsWithChildren } from 'react';
import { Metric } from '@tremor/react';
import { twMerge } from 'tailwind-merge';

export type MetricSettings = {
    isLoading: boolean;
    className?: string;
};

export const AwaitableMetric = ({ isLoading = false, className, children }: PropsWithChildren<MetricSettings>) =>
    isLoading ? (
        <Metric className={twMerge(className, 'loading-shimmer')}>&nbsp;</Metric>
    ) : (
        <Metric className={className}>{children}</Metric>
    );
