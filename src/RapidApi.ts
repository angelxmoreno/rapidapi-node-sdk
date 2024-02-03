import { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults, isAxiosError } from 'axios';
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

interface CallMethodOptions<Params> {
    method?: 'get' | 'post';
    uri: string;
    params?: Params;
}

type CallMethodReturn<Response> = { error?: Error; response?: Response };

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

    protected async handleRequest<Response = unknown>(config: AxiosRequestConfig): Promise<CallMethodReturn<Response>> {
        try {
            const { data } = await this.axiosInstance.request<Response>(config);
            return { response: data };
        } catch (e) {
            const error: Error = isAxiosError(e) ? (e.response?.data as Error) : (e as Error);

            return { error };
        }
    }

    call<Response = unknown, Params = Record<string, unknown>>({
        method,
        uri,
        params,
    }: CallMethodOptions<Params>): Promise<CallMethodReturn<Response>> {
        const config: AxiosRequestConfig = {
            method: method || 'get',
            url: uri,
            params,
        };

        return this.handleRequest<Response>(config);
    }
}
