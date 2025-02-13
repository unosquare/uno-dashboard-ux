import React from 'react';
import type { SelectItemProps } from './Select';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
    return (value) => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}

export const getNodeText = (node: React.ReactElement): string | React.ReactElement | undefined => {
    if (['string', 'number'].includes(typeof node)) return node;
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (typeof node === 'object' && node) return getNodeText(node.props.children);
};

export const constructValueToNameMapping = (children: React.ReactElement[] | React.ReactElement) => {
    const valueToNameMapping = new Map<string, string>();
    React.Children.map(children, (child: React.ReactElement<SelectItemProps>) => {
        valueToNameMapping.set(child.props.value, (getNodeText(child) ?? child.props.value) as string);
    });
    return valueToNameMapping;
};

export const getFilteredOptions = (searchQuery: string, children: React.ReactElement[]) => {
    return React.Children.map(children, (child) => {
        const optionText = (getNodeText(child) ?? child.props.value) as string;
        if (optionText.toLowerCase().includes(searchQuery.toLowerCase())) return child;
    });
};

export const ArrowDownHeadIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Down</title>
        <path d='M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z' />
    </svg>
);

export const XCircleIcon = ({ ...props }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
        <title>Close</title>
        <path d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z' />
    </svg>
);
