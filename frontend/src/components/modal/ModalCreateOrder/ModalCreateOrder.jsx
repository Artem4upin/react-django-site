import { useState } from 'react'
import './ModalCreateOrder.css'
import Button from '../../UI/Button/Button'

function ModalCreateOrder({ 
    showOrderModal, 
    setShowOrderModal, 
    createOrder, 
    selectedCount,
    totalPrice 
}) {
    const [address, setAddress] = useState('')
    const [date, setDate] = useState('')

    if (!showOrderModal) return

    const handleSubmit = () => {
        if (!address) {
            alert('Введите адрес доставки')
            return
        }
        if (!date) {
            alert('Выберите дату доставки')
            return
        }
        createOrder(address, date)
    }

    const handleCancel = () => {
        setShowOrderModal(false)
    }

    return (
        <div className="modal-create-order">
            <div className="modal-create-order__overlay"></div>
            <div className="modal-create-order__content">
                <h3>Оформление заказа</h3>
                
                <div className="modal-create-order__order-data">
                    <p>Товаров к заказу: {selectedCount} шт.</p>
                    <p>Сумма заказа: {totalPrice} ₽</p>
                </div>
                
                <div className="modal-create-order__field">
                    <label>Адрес доставки:</label>
                    <input 
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Город, улица, дом"
                        className="modal-create-order__input"
                    />
                </div>
                <div className="modal-create-order__field">
                    <label>Дата доставки:</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="modal-create-order__input"
                    />
                </div>
                
                <div className="modal-create-order__buttons">
                    <Button 
                        className="submit-btn"
                        text="Подтвердить заказ"
                        onClick={handleSubmit}
                        disabled={!address || !date}
                    />
                    <Button 
                        className="exit-btn"
                        text="Отмена"
                        onClick={handleCancel}
                    />
                </div>
            </div>
        </div>
    )
}

export default ModalCreateOrder