import "./CartButton.scss"
import {Link} from 'react-router-dom'
import CartIcon from "../../../icons/CartIcon";

function CartButton() {
    return (
        <div className='cart-button'>
            <Link to="/cart" className='cart-button__cart-link' >
                <CartIcon  />Корзина</Link>
        </div>
    )
}

export default CartButton