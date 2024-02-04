import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { RapidApi } from '../src/RapidApi';

describe('RapidApi Call Method', () => {
    const rapidApiKey = 'some-key';
    const rapidApiHost = 'some-host';
    const baseUrl = 'https://api.some-domain.com';
    const getResponse = {
        getData: {
            a: 1,
            b: 2,
        },
    };

    const postResponse = {
        postData: {
            a: 1,
            b: 2,
        },
    };

    const mock = new MockAdapter(axios);

    const rapidApiClient = new RapidApi({
        rapidApiKey,
        rapidApiHost,
        baseUrl,
    });

    afterEach(() => {
        mock.reset();
    });

    it('should make a successful GET request', async () => {
        mock.onGet(`${baseUrl}/get-endpoint`).reply(200, getResponse);

        const { response, error } = await rapidApiClient.call<typeof getResponse>({
            method: 'get',
            uri: '/get-endpoint',
            params: {
                term: 'drip',
            },
        });

        expect(error).toBeUndefined();
        expect(response).toEqual(getResponse);
    });

    it('should handle an error during GET request', async () => {
        mock.onGet(`${baseUrl}/nonexistent/endpoint`).reply(404, {
            message: "Endpoint '/nonexistent/endpoint' does not exist",
        });

        const { response, error } = await rapidApiClient.call({
            method: 'get',
            uri: '/nonexistent/endpoint',
        });

        expect(response).toBeUndefined();
        expect(error).toBeDefined();
        expect(error?.message).toBe("Endpoint '/nonexistent/endpoint' does not exist");
    });

    it('should make a successful POST request', async () => {
        mock.onPost(`${baseUrl}/post-endpoint`).reply(200, postResponse);

        const { response, error } = await rapidApiClient.call<typeof postResponse>({
            method: 'post',
            uri: '/post-endpoint',
            params: { data: 'some data' },
        });

        expect(error).toBeUndefined();
        expect(response).toEqual(postResponse);
    });

    it('should handle an error during POST request', async () => {
        mock.onPost(`${baseUrl}/nonexistent/endpoint`).reply(404, {
            message: "Endpoint '/nonexistent/endpoint' does not exist",
        });

        const { response, error } = await rapidApiClient.call({
            method: 'post',
            uri: '/nonexistent/endpoint',
            params: { data: 'some data' },
        });

        expect(response).toBeUndefined();
        expect(error).toBeDefined();
    });
});
