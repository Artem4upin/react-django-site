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
                    <Link to='/account' className='account-button__account-link'><AccountIcon />
                        {user.username}
                    </Link>)
                : (<Link to='/login'>Войти</Link>)
            }
        </div>
    )
}

export default AccountButton