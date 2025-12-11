import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList/ProductList";
import { api } from "../../api";
import './CartPage.css'
import Button from "../../components/UI/Button/Button";
import ModalCreateOrder from "../../components/modal/ModalCreateOrder/ModalCreateOrder";
import { calculateTotalPrice } from "../../utils/functions";


function CartPage() {

    const [ cartItems, setCartItems ] = useState([])
    const [selectedCartItems, setSelectedCartItems] = useState([])
    const [showOrderModal, setShowOrderModal] = useState(false)
    const [selectedItemsCount, setSelectedItemsCount] = useState(0)
    const [selectedTotalPrice, setSelectedTotalPrice] = useState(0)

    useEffect(() => {
        loadCart()
    },[])

    useEffect(() => {
        const selected = getSelectedItems()
        setSelectedItemsCount(selected.length)
        setSelectedTotalPrice(calculateTotalPrice(selected))
    }, [selectedCartItems, cartItems])

    const loadCart = async () => {
        try {
        const response = await api.get('/cart/cart-items/')
        setCartItems(response.data)
        setSelectedCartItems(response.data.map(item => item.id))
        } catch (error) {
        console.error('Ошибка', error)
        }
    }

    const handleCheckboxChange = (cartItemId, isChecked) => {
        if (isChecked) {
            setSelectedCartItems(prev => [...prev, cartItemId])
        } else {
            setSelectedCartItems(prev => prev.filter(id => id != cartItemId))
        }
    }

     const getSelectedItems = () => {
        return cartItems.filter(item => selectedCartItems.includes(item.id))
    }

    const handleOrderClick = () => {
        if (selectedItemsCount == 0) {
            return
        }
        setShowOrderModal(true)
    }

    const onItemDelete = (deletedItemId) => {
        setCartItems(prev => prev.filter(item => item.id !== deletedItemId))
        setSelectedCartItems(prev => prev.filter(id => id !== deletedItemId))
    }

    const createOrder = async (address, date) => {
        try {
            const response = await api.post('/orders/user-orders/', {
                delivery_address: address,
                delivery_date: date,
                cart_items: selectedCartItems
            })
            setShowOrderModal(false)
            setCartItems(prev => prev.filter(item => !selectedCartItems.includes(item.id)))
            setSelectedCartItems([])
        } catch (error) {
            console.error('Ошибка:', error)
            alert(error.response?.data?.error || 'Не удалось создать заказ')
        }
    }
    
    return(
        <div className="cart-page">
            <div className="cart-page__content">
                <div className="cart-page__label-container">
                    <h1 className="cart-page__label">Корзина</h1>
                </div>
                {cartItems.length == 0? 
                (<span className="cart-page__not-found">У вас еще нет товаров в корзине</span>
                ) : (
                    <div>
                        <ProductList 
                        className="products-list_one-column" 
                        products = {cartItems} 
                        isCart={true} 
                        onItemDelete={onItemDelete}
                        selectedItems={selectedCartItems}
                        onCheckboxChange={handleCheckboxChange}
                         
                        />

                         <div className="cart-total">
                            <div className="cart-total__label">Всего в корзине: {calculateTotalPrice(cartItems)} ₽</div>
                            {selectedItemsCount > 0 && (
                            <div className="cart-selected-total">
                                <div className="cart-selected-total__label">В заказе будет ({selectedItemsCount}) товаров:</div>
                                <div className="cart-selected-total__sum">{selectedTotalPrice} ₽</div>
                            </div>
                        )}
                            <div className="cart-total__button-container">
                                <Button 
                                className='submit-btn' 
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