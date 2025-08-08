import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import type { ClassNameComponent } from '../constants';
import { Metric } from '../Metric';

export const AwaitableMetric = ({ className, children }: PropsWithChildren<ClassNameComponent>) =>
    children == null ? (
        <Metric className={twMerge(className, 'loading-shimmer')}>&nbsp;</Metric>
    ) : (
        <Metric className={className}>{children}</Metric>
    );
