import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'
import { CreateTransaction, SendTransactionOtp, UpdateWalletBalance } from '../../../api/transaction';

import SpinnerButton from "../../SpinnerButton/SpinnerButton";

import closeIcon from "../../../assets/close.svg"
import PaymentOTP from '../PaymentOTP/PaymentOTP';

const formInputDefault = {
    name: "",
    phone: "",
    email: "",
    amount: 0,
}

const PaymentModal = ({ visible, onCancle, type }) => {

    const [formInput, setFormInput] = useState(formInputDefault)
    const [otpVisible, setOtpVisible] = useState(false)
    const [otp, setOtp] = useState()
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
                const response = await SendTransactionOtp(formInput?.email, token)
                if (response?.status === 200) {
                    if (type !== "withdraw") {
                        await handleTransaction()
                    } else {
                        toast.success('Đã gửi OTP xác nhận');
                        setOtpVisible(true)
                    }
                } else {
                    toast.error(`Gửi OTP xác nhận thất bại : ${response?.response?.data}`);
                }
            } else {
                toast.warning('Thông tin chưa đủ');
            }
            setLoading(false)
        }
    }

    const handleTransaction = async () => {

        let data = {}
        if (type === "withdraw") {
            data = {
                email: formInput?.email,
                balance: formInput?.amount,
                OTP: otp,
                type: 2
            }
        } else {
            data = {
                email: formInput?.email,
                balance: formInput?.amount,
                type: 1
            }
        }

        const response = await UpdateWalletBalance(data, token)
        if (response?.status === 200) {
            toast.success('Giao dịch thành công');
            setOtpVisible(true)
        } else {
            toast.error(`Giao dịch thất bại : ${response?.response?.data}`);
        }
        setLoading(false)
    }

    const handleCloseOtpModal = () => {
        setOtpVisible(false)
    }

    return (
        visible &&
        <div className="payment_modal">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Thêm tài xế của cửa hàng</div>
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
            <PaymentOTP visible={otpVisible} otp={otp} setOtp={setOtp} onSubmit={handleTransaction} onCancle={handleCloseOtpModal} />
        </div>
    )
}

export default PaymentModal
