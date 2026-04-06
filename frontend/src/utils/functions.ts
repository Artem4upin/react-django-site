import { api } from "../api";
import {NavigateFunction} from "react-router-dom";
import {ICartItem} from "../types/cart";
import { useCartStore } from "../store/useCartStore";

export function goToProduct (navigate: NavigateFunction, productId: number): void {
    navigate(`/product/${productId}`)
}

export const addToCart = async (
    productId: number,
    productQuantity: number = 1,
    ): Promise<void> => {
        try {
            await api.post('cart/cart-items/', {
                product: productId,
                quantity: productQuantity
            })
            await useCartStore.getState().loadCart()
        } catch (error) {
            console.error('Ошибка добавления в корзину')
        }
}

export const deleteFromCart = async (
    cartItemId: number,
    onItemDelete?: (id: number) => void): Promise<void> => {
        try {
            await api.delete(`/cart/cart-items/${cartItemId}/`)
            useCartStore.getState().deleteCartItem(cartItemId)
            onItemDelete?.(cartItemId)
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

export const Today = new Date().toISOString().split('T')[0]