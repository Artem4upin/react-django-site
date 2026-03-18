import { api } from "../api";
import {NavigateFunction} from "react-router-dom";
import {AxiosResponse} from "axios";
import {ICartItem} from "../types/cart";

export function goToProduct (navigate: NavigateFunction, productId: number): void {
    navigate(`/product/${productId}`)
}

export const addToCart = async (
    productId: number,
    productQuantity: number,
    productName: string): Promise<void> => {
        try {
            const response: AxiosResponse = await api.post('cart/cart-items/', {
                product: productId,
                quantity: productQuantity
            })
            alert(`Товар ${productName} добавлен в корзину`)
        } catch (error) {
            console.error('Ошибка добавления в корзину')
        }
}

export const deleteFromCart = async (
    productId: number,
    onItemDelete: (id: number) => void): Promise<void> => {
        try {
            const response = await api.delete(`/cart/cart-items/${productId}/`)
            console.log('Товар удален:', response.data)
            if (onItemDelete) {
                onItemDelete(productId)
            }
        } catch (error) {
            console.error('Ошибка удаления из корзины:', error)
            alert('Ошибка удаления товара')
        }
}

export const calculateTotalPrice = (items: ICartItem[]) => {
    return items.reduce((sum: number, item: ICartItem) => {
        return sum + (item.product_price * (item.quantity || 1))
    }, 0).toFixed(2)
}