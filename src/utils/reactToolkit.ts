import * as vueToolkit from '@guebbit/vue-toolkit';

type ICoreStore = {
    getLoading: (key?: string) => boolean;
    setLoading: (key: string, loading: boolean) => void;
};

type IStructureRestApi = {
    fetchSearch: <T>(getter: () => Promise<T>) => Promise<T>;
    fetchPaginate: <T>(getter: () => Promise<T>) => Promise<T>;
    fetchAny: <T>(getter: () => Promise<T>) => Promise<T>;
    fetchAll: <T>(getter: () => Promise<T>) => Promise<T>;
    fetchTarget: <T>(getter: () => Promise<T>) => Promise<T>;
    createTarget: <T>(getter: () => Promise<T>) => Promise<T>;
    updateTarget: <T>(getter: () => Promise<T>) => Promise<T>;
    deleteTarget: <T>(getter: () => Promise<T>) => Promise<T>;
};

type IToolkitModule = {
    notifySuccess?: (message: string) => unknown;
    notifyError?: (message: string) => unknown;
    useCoreStore?: () => ICoreStore;
    useStructureRestApi?: () => IStructureRestApi;
};

const readToolkitFunction = (name: keyof IToolkitModule) => {
    if (typeof vueToolkit !== 'object' || vueToolkit === null) return undefined;
    if (!(name in vueToolkit)) return undefined;
    const candidate = (vueToolkit as Record<string, unknown>)[name];
    return typeof candidate === 'function' ? candidate : undefined;
};

const loadingState = new Map<string, boolean>();

const fallbackCoreStore: ICoreStore = {
    getLoading: (key = 'global') => loadingState.get(key) ?? false,
    setLoading: (key, loading) => {
        loadingState.set(key, loading);
    }
};

const passthroughRequest = <T>(getter: () => Promise<T>) => getter();

const fallbackUseStructureRestApi = (): IStructureRestApi => ({
    fetchSearch: passthroughRequest,
    fetchPaginate: passthroughRequest,
    fetchAny: passthroughRequest,
    fetchAll: passthroughRequest,
    fetchTarget: passthroughRequest,
    createTarget: passthroughRequest,
    updateTarget: passthroughRequest,
    deleteTarget: passthroughRequest
});

export const reactToolkitAdapter = {
    notifySuccess: (readToolkitFunction('notifySuccess') as ((message: string) => unknown) | undefined) ?? ((message: string) => message),
    notifyError: (readToolkitFunction('notifyError') as ((message: string) => unknown) | undefined) ?? ((message: string) => message),
    useCoreStore: (readToolkitFunction('useCoreStore') as (() => ICoreStore) | undefined) ?? (() => fallbackCoreStore),
    useStructureRestApi:
        (readToolkitFunction('useStructureRestApi') as (() => IStructureRestApi) | undefined) ?? fallbackUseStructureRestApi
};

export const { notifySuccess, notifyError, useCoreStore, useStructureRestApi } = reactToolkitAdapter;
