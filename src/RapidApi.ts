import { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { addAxiosDateTransformer, createAxiosDateTransformer } from 'axios-date-transformer';
import Keyv from 'keyv';

interface RapidApiParams {
    rapidApiKey: string;
    rapidApiHost: string;
    baseUrl: string;
    axiosConfig?: CreateAxiosDefaults;
    axiosInstance?: AxiosInstance;
    cache?: Keyv;
}

export class RapidApi {
    rapidApiKey: string;
    rapidApiHost: string;
    baseUrl: string;
    axiosInstance: AxiosInstance;
    cache: Keyv;

    constructor({ rapidApiKey, rapidApiHost, baseUrl, axiosInstance, axiosConfig, cache }: RapidApiParams) {
        this.rapidApiKey = rapidApiKey;
        this.rapidApiHost = rapidApiHost;
        this.baseUrl = baseUrl;
        this.axiosInstance = this.configureAxiosInstance(axiosInstance, axiosConfig);
        this.cache = this.configureCache(cache);
    }

    protected configureAxiosInstance(axiosInstance?: AxiosInstance, axiosConfig?: CreateAxiosDefaults): AxiosInstance {
        const instance = axiosInstance
            ? addAxiosDateTransformer(axiosInstance)
            : createAxiosDateTransformer(axiosConfig);

        instance.defaults.baseURL = this.baseUrl;
        instance.defaults.headers.common['X-RapidAPI-Host'] = this.rapidApiHost;
        instance.defaults.headers.common['X-RapidAPI-Key'] = this.rapidApiKey;
        instance.defaults.headers.common['Content-Type'] = 'application/json';

        return instance;
    }

    protected configureCache(cache?: Keyv): Keyv {
        return cache || new Keyv();
    }
}
