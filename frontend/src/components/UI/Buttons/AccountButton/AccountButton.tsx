import AccountIcon from "../../../icons/AccountIcon";
import {AuthContext} from "../../../../hooks/AuthContext";
import {useContext} from "react";
import {Link} from "react-router-dom";
import './AccountButton.scss'

function AccountButton() {
    const { user } = useContext(AuthContext)
    return (
        <div className='account-button'>
            {user ? (
                    <Link to='/account' className='account-button__account-link'>
                        <AccountIcon />
                        <span>{user.username}</span>
                    </Link>)
                : (<Link to='/login' className='account-button__account-link'>Войти</Link>)
            }
        </div>
    )
}

export default AccountButton