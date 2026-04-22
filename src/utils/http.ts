import axiosClient from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import type { IResponseReject } from '@/types/http';
import { useProfileStore } from '@/stores/useProfileStore';

export type IAxiosRequestData = unknown;
export type IAxiosResponseErrorData = IResponseReject;
export type IAxiosResponseErrorBody = unknown;

const instance = axiosClient.create({
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    },
    withCredentials: true,
    timeout: Number.parseInt(import.meta.env.VITE_AXIOS_TIMEOUT ?? '10000')
});

instance.defaults.baseURL = import.meta.env.VITE_API_URL ?? '';

export const onRequest = (config: InternalAxiosRequestConfig<IAxiosRequestData>) => {
    const token = useProfileStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
};

export const onRequestReject = (error: AxiosError) => Promise.reject(error);

export const onResponseSuccess = (response: AxiosResponse): AxiosResponse['data'] => response.data;

export const onResponseReject = (error: AxiosError<IAxiosResponseErrorData, IAxiosResponseErrorBody>) => {
    if (error.response?.data && Object.hasOwn(error.response.data, 'errors')) return Promise.reject(error.response.data);

    return Promise.reject({
        success: false,
        status: 500,
        message: 'Unknown error',
        errors: [] as string[]
    } satisfies IResponseReject);
};

instance.interceptors.request.use(onRequest, onRequestReject);
instance.interceptors.response.use(onResponseSuccess, onResponseReject);

export default instance;
