import {IOrder} from "../../../types/order";
import OrderItems from "../../OrderCard/OrderItems/OrderItems";
import Button from "../../UI/Buttons/Button";
import './ModalOrderItems.scss'

interface IModalOrderItemsProps {
    order: IOrder | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

function ModalOrderItems ({
    order,
    isOpen,
    setIsOpen,
}: IModalOrderItemsProps) {

    const handleOverlayClick = () => {
        setIsOpen(false)
    }

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    if (!isOpen || !order) return null

    return (
        <div className="modal-order-items__overlay" onClick={handleOverlayClick}>
            <div className="modal-order-items__container" onClick={handleContentClick}>
                <OrderItems orderItems={order.order_items} />
                <Button text='Закрыть' onClick={() => setIsOpen(false)} />
            </div>
        </div>
    )
}

export default ModalOrderItems