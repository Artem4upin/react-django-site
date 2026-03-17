export interface ICartItem {
    id: number;
    product: number; // ID
    quantity: number;
    product_name: string;
    product_price: number;
    image_pass?: string;
}