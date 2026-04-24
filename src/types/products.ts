export interface IProduct {
    id: number;
    title: string;
    price: number;
    description?: string;
    imageUrl?: string;
    active?: boolean;
    quantity?: number;
    createdAt: string;
    updatedAt: string;
}
