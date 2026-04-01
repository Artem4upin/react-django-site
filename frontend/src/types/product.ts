import {IUserShort} from "./user";

export interface IParameter {
    id: number;
    name: string;
    category_id: number;
    category_name?: string;
    values: string[];
}

export interface IProductParameter {
    id: number;
    param_id: number;
    name: string;
    category_id: number;
    value: string;
}

export interface IProduct {
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    brand?: number;
    category_id?: number;
    subcategory_id?: number;
    creation_date?: string | Date;
    image_path?: string;
    parameters?: IProductParameter[];
    rating_avg: number;
}

export interface ICategoryGroup {
    id: number;
    name: string;
}

export interface ISubcategory {
    id: number;
    name: string;
}

export interface ICategory {
    id: number;
    name: string;
    subcategories?: ISubcategory[];
    category_group: ICategoryGroup;
}

export interface IBrand {
    id: number;
    name: string;
    image_path?: string;
}

export interface IFilters {
    category: ICategory | null;
    subcategory: ISubcategory | null;
    minPrice: number | null;
    maxPrice: number | null;
    brandId: number | null;
    paramId: number | null;
    paramValue: string | null;
    inStock: boolean;
}

export type TRating = 1 | 2 | 3 | 4 | 5 | null;

export interface IReview {
    id: number;
    product: number;
    user: IUserShort;
    rating: TRating;
    comment: string;
    created_at: string;
    image_path?: string;
}