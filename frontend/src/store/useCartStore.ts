import { create } from 'zustand';
import { api } from '../api';
import type { ICartItem } from '../types/cart';

export function cartTotalQuantity(items: ICartItem[]): number {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

interface ICartState {
    items: ICartItem[];
    isLoading: boolean;
}

interface ICartActions {
    loadCart: () => Promise<void>;
    clearCart: () => void;
    deleteCartItem: (cartItemId: number) => void;
}

export type ICartStore = ICartState & ICartActions;

export const useCartStore = create<ICartStore>((set) => ({
    items: [],
    isLoading: false,

    loadCart: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get<ICartItem[]>('/cart/cart-items/');
            set({
                items: data,
                isLoading: false
                })
            console.log(data)
        } catch (error) {
            set({ 
                items: [],
                isLoading: false
            })
            console.error('Ошибка загрузки корзины', error)
        }
    },

    clearCart: () => set({ items: [], isLoading: false }),

    deleteCartItem: (cartItemId: number) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== cartItemId),
        })),
}));
