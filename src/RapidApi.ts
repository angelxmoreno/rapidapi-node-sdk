import { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults, isAxiosError } from 'axios';
import { addAxiosDateTransformer, createAxiosDateTransformer } from 'axios-date-transformer';
import Keyv from 'keyv';

import { cacheKeyFromConfig } from './utils';

export interface RapidApiParams {
    rapidApiKey: string;
    rapidApiHost: string;
    baseUrl: string;
    axiosConfig?: CreateAxiosDefaults;
    axiosInstance?: AxiosInstance;
    cache?: Keyv;
    logger?: Logger;
}

interface CallMethodOptions<Params> {
    method?: 'get' | 'post';
    uri: string;
    params?: Params;
}

type CallMethodReturn<Response> = { error?: Error; response?: Response };

export interface Logger {
    info(message: string, data?: Record<string, unknown>): void;
}

export class RapidApi {
    rapidApiKey: string;
    rapidApiHost: string;
    baseUrl: string;
    axiosInstance: AxiosInstance;
    cache?: Keyv;
    logger?: Logger;

    constructor({ rapidApiKey, rapidApiHost, baseUrl, axiosInstance, axiosConfig, cache, logger }: RapidApiParams) {
        this.rapidApiKey = rapidApiKey;
        this.rapidApiHost = rapidApiHost;
        this.baseUrl = baseUrl;
        this.axiosInstance = this.configureAxiosInstance(axiosInstance, axiosConfig);
        this.cache = cache;
        this.logger = logger;
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

    protected log(message: string, data: Record<string, unknown> = {}): void {
        if (this.logger && data) {
            this.logger.info(message, data);
        }
    }

    protected cacheKeyFromConfig(config: AxiosRequestConfig): string {
        return cacheKeyFromConfig(this.rapidApiKey, config);
    }

    protected async handleRequest<Response = unknown>(config: AxiosRequestConfig): Promise<CallMethodReturn<Response>> {
        try {
            this.log('Making request', { config });
            let response: Response | undefined;
            const cacheKey = this.cacheKeyFromConfig(config);

            if (this.cache) {
                response = await this.cache.get(cacheKey);
                if (response === undefined) {
                    this.log('Cache miss', { cacheKey });
                } else {
                    this.log('Cache hit', { cacheKey });
                }
            }

            if (!this.cache || response === undefined) {
                const { data } = await this.axiosInstance.request<Response>(config);
                response = data;
            }

            if (this.cache && response !== undefined) {
                await this.cache.set(cacheKey, response);
            }

            this.log('Request successful', { response });
            return { response };
        } catch (e) {
            const error: Error = isAxiosError(e) ? (e.response?.data as Error) : (e as Error);

            this.log('Request failed', { error });

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

        this.log(`Calling API with method: ${config.method}, URI: ${config.url}`, { params });

        return this.handleRequest<Response>(config);
    }
}
