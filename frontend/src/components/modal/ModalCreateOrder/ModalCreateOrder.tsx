import {JSX, useState} from 'react'
import './ModalCreateOrder.scss'
import Button from '../../UI/Buttons/Button'

interface ModalCreateOrderProps {
    showOrderModal: boolean;
    setShowOrderModal: (showOrderModal: boolean) => void;
    createOrder: (address: string, deliveryDate: string) => void;
    selectedItemsCount: number;
    totalPrice: number;
}

function ModalCreateOrder({ 
    showOrderModal = true,
    setShowOrderModal, 
    createOrder,
    selectedItemsCount = 0,
    totalPrice = 0,
}: ModalCreateOrderProps): JSX.Element | null {
    const [address, setAddress] = useState('')

    if (!showOrderModal) return null

    const handleSubmit = () => {
        if (!address) {
            alert('Введите адрес доставки')
            return
        }
        
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        const deliveryDate = nextWeek.toISOString().split('T')[0]
        
        createOrder(address, deliveryDate)
    }

    const handleCancel = () => {
        setShowOrderModal(false)
    }

    return (
        <div className="modal-create-order">
            <div className="modal-create-order__overlay" onClick={handleCancel}></div>
            <div className="modal-create-order__content">
                <h3>Оформление заказа</h3>
                
                <div className="modal-create-order__order-data">
                    <p>Товаров к заказу: {selectedItemsCount} шт.</p>
                    <p>Сумма заказа: {totalPrice} ₽</p>
                    <p className="modal-create-order__delivery-info">Доставка - 7 дней</p>
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
                
                <div className="modal-create-order__buttons">
                    <Button 
                        className="submit-btn"
                        text="Подтвердить заказ"
                        onClick={handleSubmit}
                        disabled={!address}
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