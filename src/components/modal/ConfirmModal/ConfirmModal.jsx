import React from "react";
import "./styles.scss"

import close from "../../../assets/close.svg"

const ConfirmModal = ({ visible, setVisible, title, content, onConfirm, onCancle }) => {
    return (
        <div className="confirm_modal" style={{ display: visible ? "block" : "none" }}>
            <div className="modal_box">
                <div className="modal_title">
                    {title}
                </div>
                <div className="modal_content">
                    {content}
                </div>
                <div className="modal_button">
                    <div className="cancle_button" onClick={() => { onCancle() }}>Huỷ</div>
                    <div className="confirm_button" onClick={() => { onConfirm() }}>Xác nhận</div>
                </div>

                <div className="close_modal" onClick={() => { setVisible(false) }}>
                    <img src={close} alt="" />
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal