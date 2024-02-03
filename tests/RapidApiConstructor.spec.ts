import axios from 'axios';

import { RapidApi } from '../src/RapidApi';

describe('RapidApi Constructor', () => {
    it('should always have an axiosInstance', () => {
        const rapidApi = new RapidApi({
            rapidApiKey: 'key',
            rapidApiHost: 'host',
            baseUrl: 'url',
        });
        expect(rapidApi.axiosInstance).toBeDefined();

        const rapidApiWithAxiosInstance = new RapidApi({
            rapidApiKey: 'key',
            rapidApiHost: 'host',
            baseUrl: 'url',
            axiosInstance: axios.create(),
        });
        expect(rapidApiWithAxiosInstance.axiosInstance).toBeDefined();

        const rapidApiWithAxiosConfig = new RapidApi({
            rapidApiKey: 'key',
            rapidApiHost: 'host',
            baseUrl: 'url',
            axiosConfig: { withCredentials: true },
        });
        expect(rapidApiWithAxiosConfig.axiosInstance).toBeDefined();

        const rapidApiWithoutAxios = new RapidApi({
            rapidApiKey: 'key',
            rapidApiHost: 'host',
            baseUrl: 'url',
        });
        expect(rapidApiWithoutAxios.axiosInstance).toBeDefined();
    });

    it('should have the expected headers and baseURL in axiosInstance', () => {
        const rapidApi = new RapidApi({
            rapidApiKey: 'key',
            rapidApiHost: 'host',
            baseUrl: 'url',
        });
        expect(rapidApi.axiosInstance.defaults.baseURL).toEqual('url');
        expect(rapidApi.axiosInstance.defaults.headers.common['X-RapidAPI-Host']).toEqual('host');
        expect(rapidApi.axiosInstance.defaults.headers.common['X-RapidAPI-Key']).toEqual('key');
        expect(rapidApi.axiosInstance.defaults.headers.common['Content-Type']).toEqual('application/json');
    });
});
