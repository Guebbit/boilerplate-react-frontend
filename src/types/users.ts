export enum EUserRoles {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIP = 'vip'
}

export interface IUser {
    id: number;
    email: string;
    username: string;
    phone: string;
    website: string;
    language: string;
    imageUrl: string;
    roles: EUserRoles[];
}
