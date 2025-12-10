import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList/ProductList";
import { api } from "../../api";
import './CartPage.css'
import Button from "../../components/UI/Button/Button";
import ModalCreateOrder from "../../components/modal/ModalCreateOrder/ModalCreateOrder";


function CartPage() {

    const [ cartItems, setCartItems ] = useState([])
    const [selectedCartItems, setSelectedCartItems] = useState([])
    const [showOrderModal, setShowOrderModal] = useState(false)

    useEffect(() => {
        loadCart()
    },[])

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
        const selected = getSelectedItems()
        setShowOrderModal(true)
    }

    const onItemDelete = () => {
        loadCart()
    }

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price || item.product_price) * (item.quantity || 1))
        }, 0).toFixed(2)
    }

    const calculateSelectedTotal = () => {
        return getSelectedItems().reduce((sum, item) => {
            return sum + (parseFloat(item.price || item.product_price) * (item.quantity || 1))
        }, 0).toFixed(2)
    }

    const createOrder = async (address, date) => {
        try {
            const response = await api.post('/orders/user-orders/', {
                delivery_address: address,
                delivery_date: date,
                cart_items: selectedCartItems
            })
            setShowOrderModal(false)
            setSelectedCartItems([])
            loadCart()
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
                    <Button 
                    className='submit-btn' 
                    text={`Заказать (${getSelectedItems().length})`} 
                    onClick={handleOrderClick}
                    disabled={getSelectedItems().length === 0}/>
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
                            <div className="cart-total__label">Всего в корзине: {calculateTotal()} ₽</div>
                            {getSelectedItems().length > 0 && (
                            <div className="cart-selected-total">
                                <div className="cart-selected-total__label">В заказе будет ({getSelectedItems().length}) товаров:</div>
                                <div className="cart-selected-total__sum">{calculateSelectedTotal()} ₽</div>
                            </div>
                        )}
                    </div>
                        </div>
                        
                )}
                <ModalCreateOrder 
                    showOrderModal={showOrderModal}
                    setShowOrderModal={setShowOrderModal}
                    createOrder={createOrder}
                    selectedCount={getSelectedItems().length}
                    totalPrice={calculateSelectedTotal()}
                />
            </div>
        </div>
    )
}

export default CartPage