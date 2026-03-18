import {IProduct} from "./product";

export interface ICartItem {
    id: number;
    product: number;
    quantity: number;
    product_name: string;
    product_price: number;
    image_pass?: string;
}