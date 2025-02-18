import { formatter, humanize } from 'uno-js';
import { v4 as uuidv4 } from 'uuid';
import { CardLoading } from '../CardLoading';
import { Flex } from '../Flex';
import { NoData } from '../NoData';
import { Text } from '../TextElements';
import { colorPalette, getColorClassNames, themeColorRange } from '../theme';
import { unoTwMerge } from '../unoTwMerge';
import type { ChartFunnelSettings } from './chartFunnelSettings';

export const ChartFunnel = <T,>({ rawData, dataCallback, formatType, calculateSizes }: ChartFunnelSettings<T>) => {
    const dataStore = (dataCallback && rawData && dataCallback(rawData)) ?? [];

    return (
        <Flex flexDirection='col' className='w-full min-h-[160px] max-h-[210px] mt-auto mb-auto' alignItems='center'>
            {!dataStore && <CardLoading />}
            {dataStore && dataStore.length > 0 ? (
                dataStore.map((entry, index) => (
                    <div
                        key={uuidv4()}
                        title={humanize(entry.name.toString())}
                        className={unoTwMerge(
                            'rounded-sm h-[25px] mb-[5px] flex items-center justify-center',
                            entry.value
                                ? calculateSizes.sizes[
                                      calculateSizes.orderedValues.findIndex((x) => x === entry.value) ?? 0
                                  ]
                                : 'w-[30%]',
                            getColorClassNames(themeColorRange[index], colorPalette.text).bgColor,
                        )}
                    >
                        <Text className='text-white! text-xs p-1'>
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
