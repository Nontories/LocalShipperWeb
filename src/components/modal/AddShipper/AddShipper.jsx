import React, { useState, useContext, useEffect } from 'react'
import './styles.scss'
import { toast } from 'react-toastify';

import { UserContext } from '../../../context/StoreContext'
import { CreateShipper } from '../../../api/shipper';

import closeIcon from "../../../assets/close.svg"

const formInputDefault = {
    name: "",
    phone: "",
    email: "",
    storePassword: "",
    shipperPassword: "",
    rePassword: "",
}

const AddShipper = ({ visible, onCancle }) => {

    const [formInput, setFormInput] = useState(formInputDefault)
    const { store, token } = useContext(UserContext);

    const handleSubmit = async () => {
        const data = {
            fullName: formInput?.name,
            email: formInput?.email,
            phone: formInput?.phone,
            password: formInput?.shipperPassword,
            confirmPassword: formInput?.rePassword,
        }
        const response = await CreateShipper( store?.id,data, token)
        if (response?.status === 200) {
            toast.success('Thêm shipper thành công');
            onCancle()
        }
    }

    return (
        visible &&
        <div className="add_shipper">
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
                    <input type="text" id='mail' className='mail' value={formInput.email} onChange={(e) => setFormInput({ ...formInput, email: e.target.value })} />
                </div>
                <div className="input_lable">
                    <label htmlFor="store_password">Mật khẩu Store</label>
                    <input type="password" id='store_password' className='store_password' value={formInput.storePassword} onChange={(e) => setFormInput({ ...formInput, storePassword: e.target.value })} />
                </div>
                <div className="input_lable">
                    <label htmlFor="shipper_password">Mật khẩu tạm thời</label>
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

export default AddShipper
