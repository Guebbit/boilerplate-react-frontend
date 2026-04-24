export interface IResponseNeutral {
    success: boolean;
    status: number;
    message: string;
}

export interface IResponseSuccess<T> extends IResponseNeutral {
    data?: T;
    errors: never;
}

export interface IResponseReject extends IResponseNeutral {
    data?: never;
    errors: string[];
}
