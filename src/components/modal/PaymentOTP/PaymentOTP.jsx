import React, { useState, useContext, useEffect } from 'react'
import OtpInput from 'react-otp-input';
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'
import { CreateTransaction, SendTransactionOtp } from '../../../api/transaction';

import SpinnerButton from "../../SpinnerButton/SpinnerButton";

import closeIcon from "../../../assets/close.svg"

const formInputDefault = {
    name: "",
    phone: "",
    email: "",
    amount: 0,
}

const PaymentOTP = ({ visible, otp, setOtp, onCancle, onSubmit }) => {

    const [loading, setLoading] = useState(false)
    // type = 1 là nạp 2 là rút

    const handleSubmit = async () => {
        setLoading(true)
        await onSubmit()
        setLoading(false)
    }

    return (
        visible &&
        <div className="payment_otp_modal">
            <div className="layout"></div>
            <div className="content">
                <div className="title">Xác nhận giao dịch</div>
                <div className="input_lable">
                    <label htmlFor="mail">Mã OTP</label>
                    <div className="otp_input">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                        />
                    </div>
                </div>
                <div className="button_pack">
                    <div className="cancle_button" onClick={onCancle}>Hủy</div>
                    <div className="add_button" onClick={handleSubmit}>
                        <SpinnerButton isLoading={loading} content={"Xác nhận"} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentOTP
