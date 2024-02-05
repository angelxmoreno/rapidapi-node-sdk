import { AxiosRequestConfig } from 'axios';

import { cacheKeyFromConfig, generateHash } from '../src/utils';

describe('utils', () => {
    describe('cacheKeyFromConfig', () => {
        it('should generate a string from the config', () => {
            const rapidApiKey = 'test-key';
            const config: AxiosRequestConfig = {
                method: 'get',
                url: '/endpoint',
                params: { foo: 'bar', baz: 'qux' },
            };

            const result = cacheKeyFromConfig(rapidApiKey, config);

            const expectedHash =
                generateHash(rapidApiKey) + '-GE' + generateHash(config.url) + '-' + generateHash(config.params);
            expect(result).toBe(expectedHash);
        });

        it('should generate the same string when the values are the same', () => {
            const rapidApiKey = 'test-key';
            const config1: AxiosRequestConfig = {
                method: 'get',
                url: '/endpoint',
                params: { foo: 'bar', baz: 'qux' },
            };

            const config2: AxiosRequestConfig = {
                method: 'get',
                url: '/endpoint',
                params: { foo: 'bar', baz: 'qux' },
            };

            const result1 = cacheKeyFromConfig(rapidApiKey, config1);
            const result2 = cacheKeyFromConfig(rapidApiKey, config2);

            expect(result1).toBe(result2);
        });

        it('should generate the same string when the values are the same but in a different order', () => {
            const rapidApiKey = 'test-key';
            const config1: AxiosRequestConfig = {
                method: 'get',
                url: '/endpoint',
                params: { foo: 'bar', baz: 'qux' },
            };

            const config2: AxiosRequestConfig = {
                method: 'get',
                url: '/endpoint',
                params: { baz: 'qux', foo: 'bar' },
            };

            const result1 = cacheKeyFromConfig(rapidApiKey, config1);
            const result2 = cacheKeyFromConfig(rapidApiKey, config2);

            expect(result1).toBe(result2);
        });

        it('should generate different cache keys for different domains', async () => {
            const rapidApiKey = 'test-key';
            const config1: AxiosRequestConfig = {
                baseURL: 'https://api.test-domain.com',
                method: 'get',
                url: '/endpoint',
                params: { foo: 'bar', baz: 'qux' },
            };

            const config2: AxiosRequestConfig = {
                baseURL: 'https://api.other-domain.com',
                method: 'get',
                url: '/endpoint',
                params: { foo: 'bar', baz: 'qux' },
            };

            const result1 = cacheKeyFromConfig(rapidApiKey, config1);
            const result2 = cacheKeyFromConfig(rapidApiKey, config2);

            expect(result1).not.toBe(result2);
        });
    });
});
