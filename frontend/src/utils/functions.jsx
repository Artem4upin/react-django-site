import { api } from "../api";

export function goToProduct (navigate, productId) {
    navigate(`/product/${productId}`)
}

export const addToCart = async (productId, productQuantity, productName) => {
        try {
            const response = await api.post('cart/cart-items/', {
                product: productId,
                quantity: productQuantity
            })
            console.log(response.data)
            alert(`Товар ${productName} добавлен в корзину`)
        } catch (error) {
            console.error('Ошибка добавления в корзину')
        }
}

export const deleteFromCart = async (productId, onItemDelete) => {
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

    export const calculateTotalPrice = (items) => {
        return items.reduce((sum, item) => {
            return sum + (parseFloat(item.price || item.product_price) * (item.quantity || 1))
        }, 0).toFixed(2)
    }
