export interface IOrderItemSet {
    id: number;
    order: number;
    product : number;
    product_name: string;
    product_price: number;
    quantity: number;
}

export interface IOrder {
    created_at: string | Date;
    delivery_address: string;
    delivery_date: string | Date;
    id: number;
    is_deleted: boolean;
    order_number: string;
    orderitem_set: IOrderItemSet
    price_sum: number;
    status: 'Created' | 'Work' | 'Sent' | 'Done' | 'Completed'| 'Canceled';
    user_id: number;
    username: string;
}