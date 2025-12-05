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
        setCartItems(response.data)
        } catch (error) {
        console.error('Ошибка', error)
        }
    }

    const onItemDelete = () => {
        loadCart()
    }
    
    return(
        <div className="cart-page">
            <span className="cart-page__label">Корзина</span>
            {cartItems.length == 0? 
            (<span className="cart-page__not-found">У вас еще нет товаров в корзине</span>
            ) : (
                <ProductList products = {cartItems} isCart={true} onItemDelete={onItemDelete} />
            )
        }

            
        </div>
    )
}

export default CartPage