import type { AxiosProgressEvent } from 'axios';
import { z } from 'zod';
import { create } from 'zustand';

import type { CreateProductRequest, Product, SearchProductsRequest, UpdateProductByIdRequest } from '@api';
import { productsApi } from '@/utils/api';
import { notifyError, notifySuccess, useCoreStore as getCoreStore, useStructureRestApi as getStructureRestApi } from '@/utils/reactToolkit';

type IProductsFilters = Omit<SearchProductsRequest, 'page' | 'pageSize'>;

type IProductsStore = {
    products: Record<string, Product>;
    productsList: Product[];
    currentProduct: Product | null;
    selectedProductId: string | null;
    loading: boolean;
    pageCurrent: number;
    pageSize: number;
    pageTotal: number;
    pageItemList: Product[];
    fetchProducts: (forced?: boolean) => Promise<Product[]>;
    fetchPaginationProducts: (page?: number, pageSize?: number, forced?: boolean) => Promise<Product[]>;
    fetchSearchProducts: (filters?: IProductsFilters, page?: number, pageSize?: number, forced?: boolean) => Promise<Product[]>;
    fetchProduct: (productId: string, forced?: boolean) => Promise<Product>;
    createProduct: (productData: CreateProductRequest) => Promise<Product>;
    updateProduct: (productId: string, productData: UpdateProductByIdRequest) => Promise<Product>;
    updateProductImage: (
        product: Product,
        files?: File[] | FileList,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ) => Promise<Product>;
    deleteProduct: (productId: string) => Promise<void>;
    zodSchemaProductsTitle: z.ZodTypeAny;
    zodSchemaProductsPrice: z.ZodTypeAny;
    zodSchemaProducts: z.ZodTypeAny;
};

const getProductsDictionary = (items: Product[]) => Object.fromEntries(items.map((item) => [item.id, item]));

const zodSchemaProductsTitle = z.string().min(1, 'Title is required');
const zodSchemaProductsPrice = z.number().min(0, 'Price must be greater than or equal to 0');
const zodSchemaProducts = z.object({
    id: z.string().nullish().optional(),
    title: zodSchemaProductsTitle,
    price: zodSchemaProductsPrice,
    description: z.string().nullish().optional(),
    active: z.boolean().nullish().optional(),
    imageUrl: z.string().nullish().optional(),
    createdAt: z.string().nullish().optional(),
    updatedAt: z.string().nullish().optional()
});

export const useProductsStore = create<IProductsStore>((set, get) => {
    const { getLoading, setLoading } = getCoreStore();
    const restApi = getStructureRestApi();

    const withLoading = async <T>(runner: () => Promise<T>) => {
        setLoading('products', true);
        set({ loading: true });
        try {
            return await runner();
        } finally {
            setLoading('products', false);
            set({ loading: false });
        }
    };

    return {
        products: {},
        productsList: [],
        currentProduct: null,
        selectedProductId: null,
        loading: getLoading('products'),
        pageCurrent: 1,
        pageSize: 10,
        pageTotal: 0,
        pageItemList: [],

        fetchProducts: async () =>
            withLoading(async () => {
                try {
                    const items = await restApi.fetchAll(() =>
                        productsApi.listProducts().then(({ data }) => data.items ?? [])
                    );
                    set({ products: getProductsDictionary(items), productsList: items, pageItemList: items, pageTotal: items.length });
                    return items;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        fetchPaginationProducts: async (page = 1, pageSize = 10) =>
            withLoading(async () => {
                try {
                    const response = await restApi.fetchPaginate(() =>
                        productsApi.listProducts(page, pageSize).then(({ data }) => data)
                    );
                    set({
                        products: { ...get().products, ...getProductsDictionary(response.items ?? []) },
                        productsList: response.items ?? [],
                        pageItemList: response.items ?? [],
                        pageCurrent: page,
                        pageSize,
                        pageTotal: response.meta.totalItems
                    });
                    return response.items ?? [];
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        fetchSearchProducts: async (filters = {}, page = 1, pageSize = 10) =>
            withLoading(async () => {
                try {
                    const response = await restApi.fetchSearch(() =>
                        productsApi.searchProducts({ ...filters, page, pageSize }).then(({ data }) => data)
                    );
                    set({
                        products: { ...get().products, ...getProductsDictionary(response.items ?? []) },
                        productsList: response.items ?? [],
                        pageItemList: response.items ?? [],
                        pageCurrent: page,
                        pageSize,
                        pageTotal: response.meta.totalItems
                    });
                    return response.items ?? [];
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        fetchProduct: async (productId) =>
            withLoading(async () => {
                try {
                    const product = await restApi.fetchTarget(() =>
                        productsApi.getProductById(productId).then(({ data }) => data)
                    );
                    set((state) => ({
                        products: { ...state.products, [product.id]: product },
                        currentProduct: product,
                        selectedProductId: product.id
                    }));
                    return product;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        createProduct: async (productData) =>
            withLoading(async () => {
                try {
                    const product = await restApi.createTarget(() =>
                        productsApi
                            .createProduct(
                                productData.title,
                                productData.price,
                                productData.description,
                                productData.active
                            )
                            .then(({ data }) => data)
                    );
                    set((state) => ({
                        products: { ...state.products, [product.id]: product },
                        productsList: [product, ...state.productsList],
                        pageItemList: [product, ...state.pageItemList]
                    }));
                    notifySuccess('Product created');
                    return product;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        updateProductImage: async (product, files = [], onUploadProgress) =>
            withLoading(async () => {
                if (files.length === 0 || !files[0]) throw new Error('No file selected');
                try {
                    const updated = await restApi.updateTarget(() =>
                        productsApi
                            .updateProductById(
                                product.id,
                                product.title,
                                product.price,
                                product.description,
                                product.active,
                                files[0],
                                { onUploadProgress }
                            )
                            .then(({ data }) => data)
                    );
                    set((state) => ({
                        products: { ...state.products, [updated.id]: updated },
                        productsList: state.productsList.map((item) => (item.id === updated.id ? updated : item)),
                        pageItemList: state.pageItemList.map((item) => (item.id === updated.id ? updated : item)),
                        currentProduct: state.selectedProductId === updated.id ? updated : state.currentProduct
                    }));
                    notifySuccess('Product image updated');
                    return updated;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        updateProduct: async (productId, productData) =>
            withLoading(async () => {
                try {
                    const product = await restApi.updateTarget(() =>
                        productsApi
                            .updateProductById(
                                productId,
                                productData.title,
                                productData.price,
                                productData.description,
                                productData.active
                            )
                            .then(({ data }) => data)
                    );
                    set((state) => ({
                        products: { ...state.products, [product.id]: product },
                        productsList: state.productsList.map((item) => (item.id === product.id ? product : item)),
                        pageItemList: state.pageItemList.map((item) => (item.id === product.id ? product : item)),
                        currentProduct: state.selectedProductId === product.id ? product : state.currentProduct
                    }));
                    notifySuccess('Product updated');
                    return product;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        deleteProduct: async (productId) =>
            withLoading(async () => {
                try {
                    await restApi.deleteTarget(() => productsApi.deleteProductById(productId));
                    set((state) => {
                        const nextProducts = { ...state.products };
                        delete nextProducts[productId];
                        return {
                            products: nextProducts,
                            productsList: state.productsList.filter((item) => item.id !== productId),
                            pageItemList: state.pageItemList.filter((item) => item.id !== productId),
                            currentProduct: state.currentProduct?.id === productId ? null : state.currentProduct,
                            selectedProductId: state.selectedProductId === productId ? null : state.selectedProductId
                        };
                    });
                    notifySuccess('Product deleted');
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        zodSchemaProductsTitle,
        zodSchemaProductsPrice,
        zodSchemaProducts
    };
});
