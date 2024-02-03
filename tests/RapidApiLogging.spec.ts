import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import bunyan from 'bunyan';
import pino from 'pino';
import * as winston from 'winston';

import { Logger, RapidApi, RapidApiParams } from '../src/RapidApi';

describe('RapidApi Logging', () => {
    const rapidApiOptions: RapidApiParams = {
        rapidApiKey: 'test-key',
        rapidApiHost: 'test-host',
        baseUrl: 'https://api.test-domain.com',
    };
    const axiosMock = new MockAdapter(axios);
    const uri = '/endpoint';
    const params = { foobar: 'fizzbazz' };
    describe('when a a logger is passed', () => {
        const mockLogger: Logger = {
            info: jest.fn(),
        };

        const rapidApi = new RapidApi({
            ...rapidApiOptions,
            logger: mockLogger,
        });

        it('should log after a request (both success and failure)', async () => {
            const successResponse = { data: 'success' };
            const errorResponse = { data: 'failure' };

            axiosMock.onGet(uri, { params }).reply(200, successResponse);
            await rapidApi.call({ method: 'get', uri, params });
            expect(mockLogger.info).toHaveBeenCalledWith('Request successful', { response: successResponse });

            axiosMock.onGet(uri, { params }).reply(400, errorResponse);
            await rapidApi.call({ method: 'get', uri, params });
            expect(mockLogger.info).toHaveBeenCalledWith('Request failed', { error: errorResponse });
        });
    });
    describe('compatible loggers', () => {
        it('should work with pino logger', async () => {
            const logger = pino({
                name: 'pino-rapid-api',
            });
            const rapidApiPino = new RapidApi({
                ...rapidApiOptions,
                logger,
            });
            const response = { data: 'rapidApiPino' };
            axiosMock.onGet(uri, { params }).reply(200, response);
            const result = await rapidApiPino.call({
                method: 'get',
                uri,
                params,
            });
            expect(result.response).toEqual(response);
        });
        it('should work with bunyan logger', async () => {
            const logger = bunyan.createLogger({
                name: 'bunyan-rapid-api',
            });
            const rapidApi = new RapidApi({
                ...rapidApiOptions,
                logger,
            });
            const response = { data: 'success' };
            axiosMock.onGet(uri, { params }).reply(200, response);
            const result = await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(result.response).toEqual(response);
        });
        it('should work with winston logger', async () => {
            const logger = winston.createLogger({
                transports: [new winston.transports.Console()],
            });
            const rapidApi = new RapidApi({
                ...rapidApiOptions,
                logger,
            });
            const response = { data: 'success' };
            axiosMock.onGet(uri, { params }).reply(200, response);
            const result = await rapidApi.call({
                method: 'get',
                uri,
                params,
            });
            expect(result.response).toEqual(response);
        });
    });
});
