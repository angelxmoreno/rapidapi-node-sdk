import { AxiosRequestConfig } from 'axios';
import murmurhash from 'murmurhash';

export const generateHash = (value: unknown): string => {
    if (value === undefined) {
        return 'undefined';
    }

    if (typeof value === 'object' && value !== null) {
        const sortedValue = sortObjectKeys(value as Record<string, unknown>);
        return murmurhash.v2(JSON.stringify(sortedValue)).toString();
    }

    return murmurhash.v2(JSON.stringify(value)).toString();
};

export const cacheKeyFromConfig = (rapidApiKey: string, config: AxiosRequestConfig): string => {
    const methodShort = config.method ? config.method.slice(0, 2).toUpperCase() : 'UN';
    const urlHash = generateHash(config.url);
    const paramsHash = generateHash(config.params);

    return `${generateHash(rapidApiKey)}-${methodShort}${urlHash}-${paramsHash}`;
};
const sortObjectKeys = (obj: Record<string, unknown>): Record<string, unknown> => {
    return Object.keys(obj)
        .sort()
        .reduce(
            (sorted, key) => {
                const value = obj[key];
                sorted[key] = typeof value === 'object' ? sortObjectKeys(value as Record<string, unknown>) : value;
                return sorted;
            },
            {} as Record<string, unknown>,
        );
};
