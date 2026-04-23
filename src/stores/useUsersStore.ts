import type { AxiosProgressEvent } from 'axios';
import { z } from 'zod';
import { create } from 'zustand';

import type { SearchUsersRequest, UpdateUserByIdRequest, User } from '@api';
import { usersApi } from '@/utils/api';
import { notifyError, notifySuccess, useCoreStore as getCoreStore, useStructureRestApi as getStructureRestApi } from '@/utils/reactToolkit';

type IUsersFilters = Omit<SearchUsersRequest, 'page' | 'pageSize'>;

type ICreateUserRequestMultipart = {
    email: string;
    username: string;
    password: string;
    admin?: boolean;
    active?: boolean;
    imageUpload?: File;
};

type IUpdateUserByIdRequestMultipart = Pick<UpdateUserByIdRequest, 'email' | 'password' | 'username'> & {
    imageUpload?: File;
};

type IUsersStore = {
    users: Record<string, User>;
    usersList: User[];
    currentUser: User | null;
    selectedUserId: string | null;
    loading: boolean;
    pageCurrent: number;
    pageSize: number;
    pageTotal: number;
    pageItemList: User[];
    fetchUsers: () => Promise<User[]>;
    fetchPaginationUsers: (page?: number, pageSize?: number) => Promise<User[]>;
    fetchSearchUsers: (filters?: IUsersFilters, page?: number, pageSize?: number) => Promise<User[]>;
    fetchUser: (userId: string) => Promise<User>;
    createUser: (userData: ICreateUserRequestMultipart) => Promise<User>;
    updateUser: (userId: string, userData?: IUpdateUserByIdRequestMultipart) => Promise<User>;
    updateUserImage: (
        userId: string,
        files?: File[] | FileList,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ) => Promise<User>;
    deleteUser: (userId: string) => Promise<void>;
    zodSchemaUsersEmail: z.ZodTypeAny;
    zodSchemaUsersUsername: z.ZodTypeAny;
    zodSchemaUsersPassword: z.ZodTypeAny;
    zodSchemaUsers: z.ZodTypeAny;
};

const getUsersDictionary = (items: User[]) => Object.fromEntries(items.map((item) => [item.id, item]));

const zodSchemaUsersEmail = z.string().email('Invalid email');
const zodSchemaUsersUsername = z.string().min(3, 'Username should have at least 3 characters');
const zodSchemaUsersPassword = z
    .string()
    .min(8, 'Password should have at least 8 characters')
    .refine((password) => /[a-z]/.test(password), {
        message: 'Password should contain at least one lowercase letter'
    })
    .refine((password) => /[A-Z]/.test(password), {
        message: 'Password should contain at least one uppercase letter'
    })
    .refine((password) => /\d/.test(password), {
        message: 'Password should contain at least one number'
    })
    .refine((password) => /[^\dA-Za-z]/.test(password), {
        message: 'Password should contain at least one special character'
    });

const zodSchemaUsers = z.object({
    id: z.string().nullish().optional(),
    email: zodSchemaUsersEmail,
    username: zodSchemaUsersUsername,
    imageUrl: z.string().nullish().optional(),
    admin: z.boolean().nullish().optional(),
    active: z.boolean().nullish().optional(),
    createdAt: z.string().nullish().optional(),
    updatedAt: z.string().nullish().optional()
});

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error');

export const useUsersStore = create<IUsersStore>((set, get) => {
    const { getLoading, setLoading } = getCoreStore();
    const restApi = getStructureRestApi();

    /**
     * Wrap requests with loading state handling
     *
     * @param runner
     */
    const withLoading = <T>(runner: () => Promise<T>) => {
        setLoading('users', true);
        set({ loading: true });

        return runner().finally(() => {
            setLoading('users', false);
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
     */
    const fetchUsers = () =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.fetchAll(() => usersApi.listUsers().then(({ data }) => data.items ?? [])).then((items) => {
                    set({ users: getUsersDictionary(items), usersList: items, pageItemList: items, pageTotal: items.length });
                    return items;
                })
            )
        );

    /**
     * @param page
     * @param pageSize
     */
    const fetchPaginationUsers = (page = 1, pageSize = 10) =>
        withNotifiedErrors(
            withLoading(() => {
                return restApi.fetchAny(() => usersApi.listUsers(page, pageSize).then(({ data }) => data)).then((response) => {
                    set({
                        users: { ...get().users, ...getUsersDictionary(response.items ?? []) },
                        usersList: response.items ?? [],
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
     */
    const fetchSearchUsers = (filters: IUsersFilters = {}, page = 1, pageSize = 10) =>
        withNotifiedErrors(
            withLoading(() => {
                return restApi
                    .fetchSearch(() => usersApi.searchUsers({ ...filters, page, pageSize }).then(({ data }) => data))
                    .then((response) => {
                        set({
                            users: { ...get().users, ...getUsersDictionary(response.items ?? []) },
                            usersList: response.items ?? [],
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
     * @param userId
     */
    const fetchUser = (userId: string) =>
        withNotifiedErrors(
            withLoading(() => {
                return restApi.fetchTarget(() => usersApi.getUserById(userId).then(({ data }) => data)).then((user) => {
                    set((state) => ({
                        users: { ...state.users, [user.id]: user },
                        currentUser: user,
                        selectedUserId: user.id
                    }));
                    return user;
                });
            })
        );

    /**
     *
     * @param userData
     */
    const createUser = (userData: ICreateUserRequestMultipart) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi
                    .createTarget(() =>
                        usersApi
                            .createUser(
                                userData.email,
                                userData.username,
                                userData.password,
                                userData.admin,
                                userData.active,
                                userData.imageUpload
                            )
                            .then(({ data }) => data)
                    )
                    .then((user) => {
                        set((state) => ({
                            users: { ...state.users, [user.id]: user },
                            usersList: [user, ...state.usersList],
                            pageItemList: [user, ...state.pageItemList]
                        }));
                        notifySuccess('User created');
                        return user;
                    })
            )
        );

    /**
     * Change user image via the generated API
     *
     * @param userId
     * @param files
     * @param onUploadProgress
     */
    const updateUserImage = (
        userId: string,
        files: File[] | FileList = [],
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ) => {
        if (files.length === 0 || !files[0]) return Promise.reject(new Error('Image file is required for user image update'));

        return withNotifiedErrors(
            withLoading(() =>
                restApi
                    .updateTarget(() =>
                        usersApi
                            .updateUserById(userId, undefined, undefined, undefined, files[0], {
                                onUploadProgress
                            })
                            .then(({ data }) => data)
                    )
                    .then((user) => {
                        set((state) => ({
                            users: { ...state.users, [user.id]: user },
                            usersList: state.usersList.map((item) => (item.id === user.id ? user : item)),
                            pageItemList: state.pageItemList.map((item) => (item.id === user.id ? user : item)),
                            currentUser: state.selectedUserId === user.id ? user : state.currentUser
                        }));
                        notifySuccess('User image updated');
                        return user;
                    })
            )
        );
    };

    /**
     *
     * @param userId
     * @param userData
     */
    const updateUser = (userId: string, userData: IUpdateUserByIdRequestMultipart = {}) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi
                    .updateTarget(() =>
                        usersApi
                            .updateUserById(
                                userId,
                                userData.email,
                                userData.password,
                                userData.username,
                                userData.imageUpload
                            )
                            .then(({ data }) => data)
                    )
                    .then((user) => {
                        set((state) => ({
                            users: { ...state.users, [user.id]: user },
                            usersList: state.usersList.map((item) => (item.id === user.id ? user : item)),
                            pageItemList: state.pageItemList.map((item) => (item.id === user.id ? user : item)),
                            currentUser: state.selectedUserId === user.id ? user : state.currentUser
                        }));
                        notifySuccess('User updated');
                        return user;
                    })
            )
        );

    /**
     *
     * @param userId
     */
    const deleteUser = (userId: string) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.deleteTarget(() => usersApi.deleteUserById(userId)).then(() => {
                    set((state) => {
                        const nextUsers = { ...state.users };
                        delete nextUsers[userId];
                        return {
                            users: nextUsers,
                            usersList: state.usersList.filter((item) => item.id !== userId),
                            pageItemList: state.pageItemList.filter((item) => item.id !== userId),
                            currentUser: state.currentUser?.id === userId ? null : state.currentUser,
                            selectedUserId: state.selectedUserId === userId ? null : state.selectedUserId
                        };
                    });
                    notifySuccess('User deleted');
                })
            )
        );

    return {
        users: {},
        usersList: [],
        currentUser: null,
        selectedUserId: null,

        loading: getLoading('users'),
        pageCurrent: 1,
        pageSize: 10,
        pageTotal: 0,
        pageItemList: [],

        fetchUsers,
        fetchPaginationUsers,
        fetchSearchUsers,
        fetchUser,
        createUser,
        updateUser,
        updateUserImage,
        deleteUser,

        zodSchemaUsersEmail,
        zodSchemaUsersUsername,
        zodSchemaUsersPassword,
        zodSchemaUsers
    };
});
