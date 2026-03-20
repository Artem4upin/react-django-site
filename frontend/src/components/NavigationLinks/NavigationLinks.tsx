import OfficeIcon from "../icons/OfficeIcon";
import BoxIcon from "../icons/BoxIcon";
import HomeIcon from "../icons/HomeIcon";
import { Link } from 'react-router-dom';
import './NavigationLinks.scss'
import AccountButton from "../UI/Buttons/AccountButton/AccountButton";
import CartButton from "../UI/Buttons/CartButton/CartButton";
function NavigationLinks() {
    return (
        <>
            <div className='navigation-links'>
                <Link to="/"><HomeIcon />Главная</Link>
                <Link to="/catalog"><BoxIcon />Каталог</Link>
                <Link to="/about"><OfficeIcon />О нас</Link>
                <CartButton />
                <AccountButton />
            </div>
        </>
    )
}
export default NavigationLinks;