import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'

import { UserContext } from '../../../context/StoreContext'

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
        console.log(`change Password shiperId = ${shipper?.id}`);
    }

    return (
        visible &&
        <div className="change_password">
            <div className="layout" onClick={onCancle} />
            <div className="content">
                <div className="title">Thêm Shipper của cửa hàng</div>
                <div className="input_lable">
                    <label htmlFor="store_password">Mật khẩu Store</label>
                    <input type="password" id='store_password' className='store_password' value={formInput.storePassword} onChange={(e) => setFormInput({ ...formInput, storePassword: e.target.value })} />
                </div>
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
