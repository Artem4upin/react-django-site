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
    image_pass?: string;
    parameters?: IProductParameter[];
}

export interface ISubcategory {
    id: number;
    name: string;
}

export interface ICategory {
    id: number;
    name: string;
    subcategories?: ISubcategory[];
}

export interface IBrand {
    id: number;
    name: string;
}