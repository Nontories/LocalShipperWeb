import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'
import { CreateTransaction } from '../../../api/transaction';

import SpinnerButton from "../../SpinnerButton/SpinnerButton";

import closeIcon from "../../../assets/close.svg"

const formInputDefault = {
    name: "",
    phone: "",
    email: "",
    amount: 0,
}

const PaymentModal = ({ visible, onCancle, type }) => {

    const [formInput, setFormInput] = useState(formInputDefault)
    const [loading, setLoading] = useState(false)
    const { store, token } = useContext(UserContext);

    // type = 1 là nạp 2 là rút

    const handleSubmit = async () => {
        if (!loading) {
            setLoading(true)
            if (
                formInput?.name !== "" &&
                formInput?.email !== "" &&
                formInput?.phone !== "" &&
                formInput?.amount !== 0
            ) {
                const data = {
                    fullName: formInput?.name,
                    email: formInput?.email,
                    phone: formInput?.phone,
                }
                // const response = await CreateTransaction(store?.id, data, token)
                // if (response?.status === 200) {
                //     toast.success('Thanh toán thành công');
                //     onCancle()
                // } else {
                //     toast.error(`Thanh toán thành công : ${response?.response?.data}`);
                // }
            } else {
                toast.warning('Thông tin chưa đủ');
            }
            setLoading(false)
        }
    }

    return (
        visible &&
        <div className="payment_modal">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Thêm Shipper của cửa hàng</div>
                <div className="flex_column">
                    <div className="input_lable">
                        <label htmlFor="name">Họ và tên *</label>
                        <input type="text" id='name' className='name' value={formInput.name} onChange={(e) => setFormInput({ ...formInput, name: e.target.value })} />
                    </div>
                    <div className="input_lable">
                        <label htmlFor="phone">Số điện thoại *</label>
                        <input type="text" id='phone' className='phone' value={formInput.phone} onChange={(e) => setFormInput({ ...formInput, phone: e.target.value })} />
                    </div>
                </div>
                <div className="input_lable">
                    <label htmlFor="mail">Email *</label>
                    <input
                        type="text"
                        id='mail'
                        className='mail'
                        value={formInput.email}
                        onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
                    />
                </div>
                <div className="input_lable">
                    <label htmlFor="repassword">{type === "withdraw" ? "Số tiền cần rút" : "Số tiền cần nạp"}</label>
                    <input
                        type="numbder"
                        id='repassword'
                        className='repassword'
                        value={formInput.amount}
                        onChange={(e) => setFormInput({ ...formInput, amount: e.target.value })}
                    />
                </div>
                <div className="button_pack">
                    <div className="cancle_button" onClick={onCancle}>Hủy</div>
                    <div className="add_button" onClick={handleSubmit}>
                        <SpinnerButton isLoading={loading} content={"Thêm"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal
