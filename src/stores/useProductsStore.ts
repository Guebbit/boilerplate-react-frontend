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

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error');

export const useProductsStore = create<IProductsStore>((set, get) => {
    const { getLoading, setLoading } = getCoreStore();
    const restApi = getStructureRestApi();

    /**
     * Wrap requests with loading state handling
     *
     * @param runner
     */
    const withLoading = <T>(runner: () => Promise<T>) => {
        setLoading('products', true);
        set({ loading: true });

        return runner().finally(() => {
            setLoading('products', false);
            set({ loading: false });
        });
    };

    /**
     * Notify errors but keep rejection behavior
     *
     * @param request
     */
    const withNotifiedErrors = <T>(request: Promise<T>) =>
        request.catch((error: unknown) => {
            notifyError(getErrorMessage(error));
            return Promise.reject(error);
        });

    /**
     *
     * @param forced
     */
    const fetchProducts = (forced = false) =>
        withNotifiedErrors(
            withLoading(() => {
                void forced;
                return restApi.fetchAll(() => productsApi.listProducts().then(({ data }) => data.items ?? [])).then((items) => {
                    set({ products: getProductsDictionary(items), productsList: items, pageItemList: items, pageTotal: items.length });
                    return items;
                });
            })
        );

    /**
     * @param page
     * @param pageSize
     * @param forced
     */
    const fetchPaginationProducts = (page = 1, pageSize = 10, forced = false) =>
        withNotifiedErrors(
            withLoading(() => {
                void forced;
                return restApi.fetchPaginate(() => productsApi.listProducts(page, pageSize).then(({ data }) => data)).then((response) => {
                    set({
                        products: { ...get().products, ...getProductsDictionary(response.items ?? []) },
                        productsList: response.items ?? [],
                        pageItemList: response.items ?? [],
                        pageCurrent: page,
                        pageSize,
                        pageTotal: response.meta.totalItems
                    });
                    return response.items ?? [];
                });
            })
        );

    /**
     * @param filters
     * @param page
     * @param pageSize
     * @param forced
     */
    const fetchSearchProducts = (filters: IProductsFilters = {}, page = 1, pageSize = 10, forced = false) =>
        withNotifiedErrors(
            withLoading(() => {
                void forced;
                return restApi
                    .fetchSearch(() => productsApi.searchProducts({ ...filters, page, pageSize }).then(({ data }) => data))
                    .then((response) => {
                        set({
                            products: { ...get().products, ...getProductsDictionary(response.items ?? []) },
                            productsList: response.items ?? [],
                            pageItemList: response.items ?? [],
                            pageCurrent: page,
                            pageSize,
                            pageTotal: response.meta.totalItems
                        });
                        return response.items ?? [];
                    });
            })
        );

    /**
     *
     * @param productId
     * @param forced
     */
    const fetchProduct = (productId: string, forced = false) =>
        withNotifiedErrors(
            withLoading(() => {
                void forced;
                return restApi.fetchTarget(() => productsApi.getProductById(productId).then(({ data }) => data)).then((product) => {
                    set((state) => ({
                        products: { ...state.products, [product.id]: product },
                        currentProduct: product,
                        selectedProductId: product.id
                    }));
                    return product;
                });
            })
        );

    /**
     * Create a new product.
     *
     * @param productData
     */
    const createProduct = (productData: CreateProductRequest) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi
                    .createTarget(() =>
                        productsApi
                            .createProduct(
                                productData.title,
                                productData.price,
                                productData.description,
                                productData.active
                            )
                            .then(({ data }) => data)
                    )
                    .then((product) => {
                        set((state) => ({
                            products: { ...state.products, [product.id]: product },
                            productsList: [product, ...state.productsList],
                            pageItemList: [product, ...state.pageItemList]
                        }));
                        notifySuccess('Product created');
                        return product;
                    })
            )
        );

    /**
     * Change product image via multipart upload.
     *
     * @param product
     * @param files
     * @param onUploadProgress
     */
    const updateProductImage = (
        product: Product,
        files: File[] | FileList = [],
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ) => {
        if (files.length === 0 || !files[0]) return Promise.reject(new Error('Image file is required for product image update'));

        return withNotifiedErrors(
            withLoading(() =>
                restApi
                    .updateTarget(() =>
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
                    )
                    .then((updated) => {
                        set((state) => ({
                            products: { ...state.products, [updated.id]: updated },
                            productsList: state.productsList.map((item) => (item.id === updated.id ? updated : item)),
                            pageItemList: state.pageItemList.map((item) => (item.id === updated.id ? updated : item)),
                            currentProduct: state.selectedProductId === updated.id ? updated : state.currentProduct
                        }));
                        notifySuccess('Product image updated');
                        return updated;
                    })
            )
        );
    };

    /**
     * Update an existing product by ID.
     *
     * @param productId
     * @param productData
     */
    const updateProduct = (productId: string, productData: UpdateProductByIdRequest) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi
                    .updateTarget(() =>
                        productsApi
                            .updateProductById(
                                productId,
                                productData.title,
                                productData.price,
                                productData.description,
                                productData.active
                            )
                            .then(({ data }) => data)
                    )
                    .then((product) => {
                        set((state) => ({
                            products: { ...state.products, [product.id]: product },
                            productsList: state.productsList.map((item) => (item.id === product.id ? product : item)),
                            pageItemList: state.pageItemList.map((item) => (item.id === product.id ? product : item)),
                            currentProduct: state.selectedProductId === product.id ? product : state.currentProduct
                        }));
                        notifySuccess('Product updated');
                        return product;
                    })
            )
        );

    /**
     * Delete a product by ID.
     *
     * @param productId
     */
    const deleteProduct = (productId: string) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.deleteTarget(() => productsApi.deleteProductById(productId)).then(() => {
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
                })
            )
        );

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

        fetchProducts,
        fetchPaginationProducts,
        fetchSearchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        updateProductImage,
        deleteProduct,

        zodSchemaProductsTitle,
        zodSchemaProductsPrice,
        zodSchemaProducts
    };
});
