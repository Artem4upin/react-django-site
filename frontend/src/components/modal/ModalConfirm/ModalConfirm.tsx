import React from "react";
import Button from "../../UI/Buttons/Button";
import "./ModalConfirm.css";

interface IModalConfirmProps {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    newStatus: string;
}

function ModalConfirm({
        showModal = true,
        setShowModal,
        onConfirm = () => {},
        onCancel = () => {},
        newStatus = '',
}:IModalConfirmProps) {
    if (!showModal) return null;

    return (
        <div className="modal-confirm">
            <div className="modal-confirm__overlay" onClick={() => setShowModal(false)}></div>
            <div className="modal-confirm__main-container">
                <div className="modal-confirm__title">
                    <h3>Подтвердите действие</h3>
                </div>
                <p className="modal-confirm__message">Вы уверены что хотите изменить статус заказа?</p>
                {(newStatus === 'Completed' || newStatus === 'Canceled') && (
                    <p className="modal-confirm__message">Заказ будет перемещен в архив</p>
                )}
                <div className="modal-confirm__buttons-container">
                    <Button 
                        className={'btn'}
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            setShowModal(false);
                        }}
                        text={'Да'}
                    />
                    <Button 
                        className={"btn"}
                        onClick={() => {
                            if (onCancel) onCancel();
                            setShowModal(false);
                        }}
                        text={"Нет"}
                    />
                </div>
            </div>
        </div>
    );
}

export default ModalConfirm;