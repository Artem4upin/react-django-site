import { useContext, useEffect, useState } from "react";
import ProductList from "../../components/ProductList/ProductList";
import { api } from "../../api";
import './CartPage.scss'
import Button from "../../components/UI/Buttons/Button";
import ModalCreateOrder from "../../components/modal/ModalCreateOrder/ModalCreateOrder";
import { calculateTotalPrice } from "../../utils/functions";
import { AuthContext } from "../../hooks/AuthContext";
import Loading from "../../components/UI/Loading/Loading";
import { useCartStore } from "../../store/useCartStore";
import { ICartItem } from "../../types/cart";


function CartPage() {

    const { user } = useContext(AuthContext)
    const cartItems = useCartStore((state) => state.items)
    const isLoading = useCartStore((state) => state.isLoading)

    const [selectedCartItems, setSelectedCartItems] = useState<number[]>([])
    const [showOrderModal, setShowOrderModal] = useState(false)
    const [selectedItemsCount, setSelectedItemsCount] = useState<number>(0)
    const [selectedTotalPrice, setSelectedTotalPrice] = useState<number>(0)

    useEffect(() => {
        let cancelled = false;
        (async () => {
            await useCartStore.getState().loadCart()
            if (cancelled) return
            const items: ICartItem[] = useCartStore.getState().items
            setSelectedCartItems(items.map((item: ICartItem) => item.id))
        })()
        return () => {
            cancelled = true
        }
    }, [user])

    useEffect(() => {
        const selected: ICartItem[] = cartItems.filter(item => selectedCartItems.includes(item.id))
        setSelectedItemsCount(selected.length)
        setSelectedTotalPrice(Number(calculateTotalPrice(selected)))
    }, [selectedCartItems, cartItems])

    const handleCheckboxChange = (cartItemId: number, isChecked: boolean) => {
        if (isChecked) {
            setSelectedCartItems(prev => [...prev, cartItemId])
        } else {
            setSelectedCartItems(prev => prev.filter(id => id != cartItemId))
        }
    }

    const handleOrderClick = () => {
        if (selectedItemsCount == 0) {
            return
        }
        setShowOrderModal(true)
    }

    const onItemDelete = (deletedItemId: number) => {
        setSelectedCartItems(prev => prev.filter(id => id !== deletedItemId))
    }

    const createOrder = async (address: string, date: Date | string) => {
        try {
             await api.post('/orders/user-orders/', {
                delivery_address: address,
                delivery_date: date,
                cart_items: selectedCartItems
            })
            setShowOrderModal(false)
            await useCartStore.getState().loadCart()
            const itemsAfterOrder: ICartItem[] = useCartStore.getState().items
            setSelectedCartItems(itemsAfterOrder.map((item: ICartItem) => item.id))
        } catch (error: any) {
            console.error('Ошибка:', error)
            alert(error.response?.data?.error || 'Не удалось создать заказ')
        }
    }

    if (isLoading && cartItems.length === 0) {
        return <Loading fullPage={true} />
    }

    return(
        <div className="cart-page">
            <div className="cart-page__content">
                <div className="cart-page__label-container">
                    <h1 className="cart-page__label">Корзина</h1>
                </div>
                
                {cartItems.length == 0? 
                (<span className="cart-page__not-found">У вас еще нет товаров в корзине{!user && (', чтобы воспользоваться корзиной войдите в аккаунт')} </span>
                ) : (
                    <div>
                        <ProductList 
                        className={"products-list_one-column"}
                        products = {cartItems} 
                        isCart={true} 
                        onItemDelete={onItemDelete}
                        selectedItems={selectedCartItems}
                        onCheckboxChange={handleCheckboxChange}
                         
                        />

                         <div className="cart-page__selected-total">
                            <div className="cart-page__selected-total-label">Всего в корзине: {calculateTotalPrice(cartItems)} ₽</div>
                            {selectedItemsCount > 0 && (
                            <div className="cart-page__selected-total">
                                <div className="cart-page__selected-total-label">В заказе будет ({selectedItemsCount}) товаров:</div>
                                <div className="cart-page__selected-total-sum">{selectedTotalPrice} ₽</div>
                            </div>
                        )}
                            <div className="cart-page__button-container">
                                <Button 
                                className={'submit-btn'}
                                text={`Заказать (${selectedItemsCount})`} 
                                onClick={handleOrderClick}
                                disabled={selectedItemsCount === 0}/>
                            </div>
                        </div>
                    </div>
                        
                )}
                <ModalCreateOrder 
                    showOrderModal={showOrderModal}
                    setShowOrderModal={setShowOrderModal}
                    createOrder={createOrder}
                    selectedItemsCount={selectedItemsCount}
                    totalPrice={selectedTotalPrice} 
                />
            </div>
        </div>
    )
}

export default CartPage