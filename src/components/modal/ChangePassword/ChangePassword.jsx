import React, { useState, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import './styles.scss'

import { UserContext } from '../../../context/StoreContext'
import { ChangePasswordByStore } from '../../../api/auth'

import closeIcon from "../../../assets/close.svg"

const formInputDefault = {
    storePassword: "",
    shipperPassword: "",
    rePassword: "",
}

const ChangePassword = ({ shipper, visible, onCancle }) => {

    const [formInput, setFormInput] = useState(formInputDefault)
    const { store, token } = useContext(UserContext);

    const handleSubmit = async () => {
        if (formInput.shipperPassword === formInput.rePassword) {
            const response = await ChangePasswordByStore(shipper?.id, formInput.shipperPassword)
            if (response?.status === 200) {
                toast.success(`Cập nhật mật khẩu cho ${shipper?.fullname} thành công`);
            }else{
                toast.error(`Cập nhật mật khẩu cho thất bại`);
            }
        } else {
            toast.error(`Mật khẩu sai`);
        }
    }

    return (
        visible &&
        <div className="change_password">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Đặt lại mật khẩu của tài xế {shipper?.fullname}</div>
                <div className="input_lable">
                    <label htmlFor="shipper_password">Mật khẩu mới</label>
                    <input type="password" id='shipper_password' className='shipper_password' value={formInput.shipperPassword} onChange={(e) => setFormInput({ ...formInput, shipperPassword: e.target.value })} />
                </div>
                <div className="input_lable">
                    <label htmlFor="repassword">Nhập lại mật khẩu</label>
                    <input type="password" id='repassword' className='repassword' value={formInput.rePassword} onChange={(e) => setFormInput({ ...formInput, rePassword: e.target.value })} />
                </div>
                <div className="button_pack">
                    <div className="cancle_button" onClick={onCancle}>Hủy</div>
                    <div className="add_button" onClick={handleSubmit}>Thêm</div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
