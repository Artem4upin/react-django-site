// components/modal/ModalConfirm/ModalConfirm.jsx
import React from "react";
import Button from "../../UI/Button/Button";
import "./ModalConfirm.css";

function ModalConfirm({ showModal, setShowModal, onConfirm, onCancel }) {
    if (!showModal) return null;

    return (
        <div className="modal-confirm">
            <div className="modal-confirm__overlay" onClick={() => setShowModal(false)}></div>
            <div className="modal-confirm__main-container">
                <div className="modal-confirm__title">
                    <h3>Подтвердите действие</h3>
                </div>
                <p className="modal-confirm__message">Вы уверены что хотите изменить статус заказа?</p>
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