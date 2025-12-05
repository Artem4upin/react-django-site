import { useEffect, useState } from "react";
import ProductList from "../../components/ProductList/ProductList";
import { api } from "../../api";


function CartPage() {

    const [ cartItems, setCartItems ] = useState([])

    useEffect(() => {
        loadCart()
    },[])

    const loadCart = async () => {
        try {
        const response = await api.get('/cart/cart-items/')
        console.log(response.data)
        setCartItems(response.data)
        } catch (error) {
        console.error('Ошибка', error)
        }
    }

    const deleteFromCart = async () => {
        console.log('Удаление')
    }
    
    return(
        <div className="cart-page">
            <span className="cart-page__label">Корзина</span>

            <ProductList products = {cartItems} deleteFromCart={deleteFromCart} isCart={true}/>
        </div>
    )
}

export default CartPage