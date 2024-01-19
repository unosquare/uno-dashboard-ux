import React from 'react';
import { Flex, Text } from '@tremor/react';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { formatter, humanize } from 'uno-js';
import { CardLoading } from '../CardLoading';
import { NoData } from '../NoData';
import { ChartFunnelSettings } from './chartFunnelSettings';

export const ChartFunnel = <T,>({ rawData, dataCallback, formatType, calculateSizes }: ChartFunnelSettings<T>) => {
    const dataStore = (dataCallback && rawData && dataCallback(rawData)) ?? [];
    return (
        <Flex flexDirection='col' className='w-full min-h-[160px] max-h-[210px] mt-auto mb-auto' alignItems='center'>
            {!dataStore && <CardLoading />}
            {dataStore && dataStore.length > 0 ? (
                dataStore.map((entry, index) => (
                    <div
                        key={index}
                        title={humanize(entry.name.toString())}
                        className={tremorTwMerge(
                            'rounded h-[25px] mb-[5px] flex items-center justify-center',
                            entry.value
                                ? calculateSizes.sizes[
                                      calculateSizes.orderedValues.findIndex((x) => x === entry.value) ?? 0
                                  ]
                                : 'w-[30%]',
                            getColorClassNames(themeColorRange[index], colorPalette.text).bgColor,
                        )}
                    >
                        <Text className='!text-white text-xs p-1'>
                            {entry.name} - {formatter(entry.value, formatType)}
                        </Text>
                    </div>
                ))
            ) : (
                <NoData />
            )}
        </Flex>
    );
};
