import "./CartButton.scss"
import {Link} from 'react-router-dom'
import CartIcon from "../../../icons/CartIcon";
import { useCartStore, cartTotalQuantity } from "../../../../store/useCartStore";

function CartButton() {

    const count = useCartStore((state) => cartTotalQuantity(state.items));

    return (
        <div className='cart-button'>
            <Link to="/cart" className='cart-button__cart-link' >
                <span className="cart-button__count-wrap">
                    {count > 0 && (
                        <p className="cart-button__count">
                            {count > 99 ? '99+' : count}
                        </p>
                    )}
                    <CartIcon />
                </span>
                Корзина
            </Link>
        </div>
    )
}

export default CartButton