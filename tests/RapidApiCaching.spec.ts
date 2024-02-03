import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Keyv from 'keyv';

import { RapidApi, Logger, RapidApiParams } from '../src/RapidApi';

describe('RapidApi Caching', () => {
    const rapidApiOptions: RapidApiParams = {
        rapidApiKey: 'test-key',
        rapidApiHost: 'test-host',
        baseUrl: 'https://api.test-domain.com',
        cache: new Keyv(),
    };
    const axiosMock = new MockAdapter(axios);
    const uri = '/endpoint';
    const params = { foobar: 'fizzbazz' };

    const mockLogger: Logger = {
        info: jest.fn(),
    };

    describe('with caching enabled', () => {
        const rapidApi = new RapidApi({
            ...rapidApiOptions,
            logger: mockLogger,
        });

        it('should cache a successful response', async () => {
            const response = { data: 'success' };
            axiosMock.onGet(uri, { params }).reply(200, response);

            // First call - cache miss
            await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(mockLogger.info).toHaveBeenCalledWith('Cache miss', { cacheKey: expect.any(String) });

            // Second call - cache hit
            await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(mockLogger.info).toHaveBeenCalledWith('Cache hit', { cacheKey: expect.any(String) });
        });

        it('should not cache a failed response', async () => {
            const errorResponse = { data: 'failure' };
            axiosMock.onGet(uri, { params }).reply(400, errorResponse);

            // First call - cache miss
            await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(mockLogger.info).toHaveBeenCalledWith('Cache miss', { cacheKey: expect.any(String) });

            // Second call - cache miss (failed responses are not cached)
            await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(mockLogger.info).toHaveBeenCalledWith('Cache miss', { cacheKey: expect.any(String) });
        });
    });

    describe.skip('with caching disabled', () => {
        const rapidApi = new RapidApi({
            ...rapidApiOptions,
            cache: undefined,
        });

        it('should not cache a successful response', async () => {
            const response = { data: 'success' };
            axiosMock.onGet(uri, { params }).reply(200, response);

            // First call - no caching
            await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(mockLogger.info).not.toHaveBeenCalledWith('Cache miss', { cacheKey: expect.any(String) });

            // Second call - no caching
            await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(mockLogger.info).not.toHaveBeenCalledWith('Cache miss', { cacheKey: expect.any(String) });
        });
    });
});
