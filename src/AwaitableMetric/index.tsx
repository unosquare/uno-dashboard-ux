import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import type { ClassNameComponent } from '../constants';
import { Metric } from '../Metric';

type CustomAwaitableMetricProps = PropsWithChildren<ClassNameComponent> & {
    onClick?: () => void;
};

export const AwaitableMetric = ({ className, children, onClick }: CustomAwaitableMetricProps) =>
    children == null ? (
        <Metric className={twMerge(className, 'loading-shimmer')}>&nbsp;</Metric>
    ) : (
        <Metric className={className} onClick={onClick}>
            {children}
        </Metric>
    );
